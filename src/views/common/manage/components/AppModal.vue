<script lang="ts" setup>
    import axios from '@/axios/http';
    import * as Yup from 'yup';
    import { lewSetForm } from 'lew-ui';
    let visible = ref(false);
    const formRef = ref();
    const app_id = ref<any>('');
    const emit = defineEmits(['success']);

    const ok = () => {
        return new Promise(async (resolve) => {
            const vail = await formRef.value.validate();
            if (vail) {
                if (app_id.value) {
                    axios
                        .put({
                            url: `/app/${app_id.value}`,
                            data: formRef.value.getForm()
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                LewMessage.success('更新成功！');
                                visible.value = false;
                                emit('success');
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        })
                        .catch(() => {
                            resolve(false);
                        });
                } else {
                    axios
                        .post({
                            url: '/app',
                            data: formRef.value.getForm()
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                LewMessage.success('创建成功！');
                                visible.value = false;
                                emit('success');
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        })
                        .catch(() => {
                            resolve(false);
                        });
                }
            } else {
                resolve(false);
            }
        });
    };

    const open = (app: any = {}) => {
        const { id, name, app_code, home_url, keywords, description } = app;
        if (id) {
            app_id.value = id;
            lewSetForm({
                formRef: formRef,
                params: { name, app_code, home_url, keywords, description }
            });
        } else {
            app_id.value = '';
            lewSetForm({
                formRef: formRef,
                params: {}
            });
        }
        visible.value = true;
    };

    const options = computed(() => {
        return [
            {
                field: 'name',
                label: '名称',
                as: 'input',
                rules: Yup.string().required()
            },
            {
                field: 'app_code',
                label: 'App Code',
                props: {
                    // 禁用
                    disabled: !!app_id.value
                },
                as: 'input',
                rules: Yup.string().required()
            },
            {
                field: 'home_url',
                label: '主页网址',
                as: 'input',
                rules: Yup.string().required()
            },
            {
                field: 'keywords',
                label: '关键词',
                as: 'input-tag',

                inputFormat: (value: any) => {
                    return (value && value.split(',')) || [];
                },
                outputFormat: (row: any) => {
                    return (row.value && row.value.join(',')) || [];
                },
                rules: Yup.array().required()
            },
            {
                field: 'description',
                label: '描述',
                as: 'textarea',
                rules: Yup.string().required()
            }
        ];
    });

    defineExpose({ open });
</script>

<template>
    <lew-modal
        v-model:visible="visible"
        width="380px"
        close-by-esc
        :title="`${app_id ? '更新' : '新建'}App`"
        :ok-props="{
            request: ok
        }"
        @cancel="visible = false"
    >
        <div class="modal-body">
            <lew-form ref="formRef" :options="options" :label-width="80" />
        </div>
    </lew-modal>
</template>

<style lang="scss" scoped>
    .modal-body {
        padding: 30px;
    }
</style>
