<script lang="ts" setup>
    import axios from '@/axios/http';
    import { useRouter, useRoute } from 'vue-router';
    import { MdEditor, config } from 'md-editor-v3';
    import 'md-editor-v3/lib/style.css';
    import * as Yup from 'yup';

    const TargetBlankExtension = (md: any) => {
        const defaultRender =
            md.renderer.rules.link_open ||
            function (tokens: any, idx: any, options: any, env: any, self: any) {
                return self.renderToken(tokens, idx, options);
            };
        md.renderer.rules.link_open = function (
            tokens: any,
            idx: any,
            options: any,
            env: any,
            self: any
        ) {
            const aIndex = tokens[idx].attrIndex('target');

            if (aIndex < 0) {
                tokens[idx].attrPush(['target', '_blank']);
            } else {
                tokens[idx].attrs[aIndex][1] = '_blank';
            }

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };
    };

    config({
        markdownItConfig(md) {
            md.use(TargetBlankExtension);
        }
    });

    const route = useRoute();
    const router = useRouter();
    let seriesOptions = ref([]);
    let loading = ref(false);
    let visible = ref(false);
    let formRef = ref();
    const formOptions: any = ref();
    let articleForm = ref({
        id: '',
        title: '',
        description: '',
        content: '',
        series_id: '',
        tags: [] as any
    });

    const getSeries = () => {
        loading.value = true;
        axios
            .get({
                url: '/series/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    seriesOptions.value = res.data.map((e: any) => {
                        return {
                            label: e.title,
                            value: String(e.id)
                        };
                    });
                    formOptions.value = [
                        {
                            field: 'series_id', // 字段名
                            label: '选择系列', // 标签
                            as: 'select', // 组件
                            rules: Yup.string().required('不能为空'), // 校验规则
                            props: {
                                options: seriesOptions.value
                            }
                        },
                        {
                            field: 'tags', // 字段名
                            label: '添加标签', // 标签
                            as: 'input-tag', // 组件
                            rules: Yup.array().required('不能为空') // 校验规则
                        },
                        {
                            field: 'description', // 字段名
                            label: '文章描述', // 标签
                            as: 'textarea', // 组件
                            rules: Yup.string().required('不能为空'), // 校验规则
                            props: {
                                // 组件props
                                showCount: true,
                                maxLength: 250
                            }
                        }
                    ];
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const getArticle = () => {
        axios
            .get({
                url: '/article/' + route.query.id
            })
            .then((res: any) => {
                if (res.code == 200) {
                    const { id, title, description, content, series_id, tags } = res.data;
                    articleForm.value = {
                        id: id,
                        title: title,
                        description: description,
                        content: content,
                        series_id: String(series_id),
                        tags: tags ? tags.map((e: any) => e.title) : []
                    };
                }
            });
    };

    const saveFn = () => {
        return new Promise<any>((resolve) => {
            let data = JSON.parse(
                JSON.stringify({ ...articleForm.value, ...formRef.value.getForm() })
            );
            data.tags = data.tags.map((e: any) => {
                return {
                    title: e
                };
            });
            data.series_id = parseInt(data.series_id);

            if (data.id) {
                axios
                    .put({
                        url: '/article/' + data.id,

                        data: data
                    })
                    .then((res: any) => {
                        if (res.success) {
                            LewMessage.success('更新成功');
                            resolve(true);
                            router.push('/common/article');
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => {
                        resolve(false);
                    });
            } else {
                delete data.id;
                axios
                    .post({
                        url: '/article',
                        data: data
                    })
                    .then((res: any) => {
                        if (res.success) {
                            LewMessage.success('发布成功');
                            resolve(true);
                            router.push('/common/article');
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => {
                        resolve(false);
                    });
            }
        });
    };

    const checkVisible = () => {
        if (articleForm.value.title == '') {
            LewMessage.error('标题不能为空');
            return;
        }
        if (articleForm.value.content == '') {
            LewMessage.error('内容不能为空');
            return;
        }
        setForm();
        visible.value = true;
    };

    onMounted(() => {
        getSeries();
        if (route.query.id) {
            getArticle();
        }
    });

    const setForm = () => {
        if (formRef.value) {
            formRef.value.setForm(articleForm.value);
        } else {
            setTimeout(() => {
                setForm();
            }, 100);
        }
    };
</script>
<template>
    <div v-loading="{ isShow: loading }">
        <lew-flex x="start" class="header">
            <input v-model="articleForm.title" type="text" placeholder="输入文章标题" />
            <lew-button type="light" round @click="checkVisible"> 保存 </lew-button>
        </lew-flex>

        <md-editor
            v-model="articleForm.content"
            class="editor-wrapper"
            show-code-row-number
            preview
        />

        <lew-modal
            v-model:visible="visible"
            :title="articleForm.id ? '更新文章' : '发布文章'"
            width="400"
            :ok-props="{
                request: saveFn
            }"
            @cancel="visible = false"
        >
            <div class="modal-body">
                <lew-form
                    ref="formRef"
                    label-width="80"
                    :options="formOptions"
                    @change="
                        (e:any) => {
                            articleForm = {...articleForm , ...e};
                        } 
                    "
                >
                </lew-form>
            </div>
        </lew-modal>
    </div>
</template>

<style lang="scss" scoped>
    .header {
        position: sticky;
        top: 0px;
        height: 60px;
        padding: 0px 20px 0px 0px;
        z-index: 99;
        box-sizing: border-box;
        background-color: var(--lew-form-bgcolor);
        border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
        transition: var(--lew-form-transition);

        input {
            width: 100%;
            height: 50px;
            border: none;
            outline: none;
            font-size: 20px;
            padding-left: 20px;
            background: none;
        }
    }

    .editor-wrapper {
        min-height: calc(100vh - 110px);
    }

    .header:focus-within {
        border: var(--lew-form-border-width) var(--lew-form-border-color-focus) solid;
        background-color: var(--lew-form-bgcolor-focus);
    }

    .modal-body {
        padding: 30px;
        box-sizing: border-box;

        .head_img {
            width: 100px;
            height: 100px;
            object-fit: contain;
        }
    }
</style>
