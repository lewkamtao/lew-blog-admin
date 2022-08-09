<script lang="ts" setup>
    import axios from '@/axios/http';
    import { useRouter, useRoute } from 'vue-router';
    import { ref, onMounted } from 'vue';

    const route = useRoute();
    const router = useRouter();
    let addModal = ref(false);

    let options = ref([]);

    let articleForm = ref({
        id: '',
        title: '',
        cover: '',
        description: '',
        content: '',
        series_id: '',
        tags: [] as any
    });

    const getSeries = () => {
        axios
            .get({
                url: '/series/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    options.value = res.data.map((e: any) => {
                        return {
                            label: e.title,
                            value: String(e.id)
                        };
                    });
                    console.log(options.value);
                }
            });
    };

    const getArticle = () => {
        axios
            .get({
                url: '/article/' + route.query.id
            })
            .then((res: any) => {
                if (res.code == 200) {
                    const { id, title, cover, description, content, series_id, tags } = res.data;
                    articleForm.value = {
                        id: id,
                        title: title,
                        cover: cover,
                        description: description,
                        content: content,
                        series_id: String(series_id),
                        tags: tags ? tags.map((e: any) => e.title) : []
                    };
                }
            });
    };

    const save = () => {
        addModal.value = true;
    };

    const saveFn = () => {
        let data = JSON.parse(JSON.stringify(articleForm.value));
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
                    if (res.code == 200) {
                        LewMessage.success('更新成功');
                        changeTag();
                        router.push('/Article');
                    }
                });
        } else {
            axios
                .post({
                    url: '/article',
                    data: data
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        LewMessage.success('发布成功');
                        router.push('/Article');
                    }
                });
        }
    };

    const changeTag = () => {
        axios
            .delete({
                url: `/articleTag?article_id=6&tag_title=4`
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('删除成功');
                }
            });
    };

    onMounted(() => {
        getSeries();
        if (route.query.id) {
            getArticle();
        }
    });
</script>
<template>
    <div>
        <lew-flex x="start" class="header">
            <input type="text" placeholder="输入文章标题" v-model="articleForm.title" />
            <lew-button @click="addModal = true">
                {{ articleForm.id ? '立即更新' : '立即发布' }}
            </lew-button>
        </lew-flex>
        <v-md-editor
            @save="save"
            v-model="articleForm.content"
            height="calc(100vh - 110px)"
        ></v-md-editor>
        <lew-modal :visible="addModal" width="400px" @mask-click="addModal = false">
            <div class="modal-body">
                <lew-title :bold="700" style="margin-bottom: 20px"
                    >{{ articleForm.id ? '更新文章' : '发布文章' }}
                </lew-title>

                <lew-form-item title="选择系列">
                    <lew-radio-group
                        v-model="articleForm.series_id"
                        block
                        :iconable="false"
                        :options="options"
                    ></lew-radio-group>
                </lew-form-item>

                <lew-form-item title="添加标签">
                    <lew-input-tag v-model="articleForm.tags" />
                </lew-form-item>
                <lew-form-item title="封面图片">
                    <lew-input v-model="articleForm.cover" />
                </lew-form-item>
                <lew-form-item title="文章标题">
                    <lew-input
                        v-model="articleForm.title"
                        :max-length="120"
                        show-count
                        nice-count
                    />
                </lew-form-item>
                <lew-form-item style="margin-bottom: 30px" title="文章描述">
                    <lew-input
                        v-model="articleForm.description"
                        type="textarea"
                        show-count
                        :max-length="250"
                    />
                </lew-form-item>

                <lew-flex x="end">
                    <lew-button type="normal" @click="addModal = false">关闭 </lew-button>
                    <lew-button @click="saveFn">
                        {{ articleForm.id ? '立即更新' : '立即发布' }}
                    </lew-button>
                </lew-flex>
            </div>
        </lew-modal>
    </div>
</template>

<style lang="scss" scoped>
    .header {
        height: 60px;
        padding: 0px 20px 0px 0px;
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
    .header:focus-within {
        border: var(--lew-form-border-width) var(--lew-form-border-color-focus) solid;
        background-color: var(--lew-form-bgcolor-focus);
    }
    .modal-body {
        padding: 30px;
    }
</style>
