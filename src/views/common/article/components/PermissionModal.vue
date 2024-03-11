<script lang="ts" setup>
    import axios from '@/axios/http';
    import * as Yup from 'yup';
    import { lewSetForm } from 'lew-ui';
    let visible = ref(false);

    const formRef = ref();
    const permission_id = ref<any>('');
    const _app_id = ref<any>('');
    const permissionTypeOptions = ref<any>([]);
    const emit = defineEmits(['success']);

    const ok = () => {
        return new Promise(async (resolve) => {
            const vail = await formRef.value.validate();
            if (vail) {
                if (permission_id.value) {
                    axios
                        .put({
                            url: `/permission/${permission_id.value}`,
                            data: {
                                ...formRef.value.getForm(),
                                app_id: Number(_app_id.value)
                            }
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
                            url: '/permission',
                            data: {
                                ...formRef.value.getForm(),
                                app_id: Number(_app_id.value)
                            }
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

    const open = (
        { id, name, description, code, permission_type, app_id } = {
            id: undefined,
            name: undefined,
            code: undefined,
            description: undefined,
            permission_type: undefined,
            app_id: undefined
        }
    ) => {
        _app_id.value = app_id;
        if (id) {
            permission_id.value = id;
            lewSetForm({
                formRef: formRef,
                params: { name, description, permission_type, code }
            });
        } else {
            permission_id.value = '';
            lewSetForm({
                formRef: formRef,
                params: {}
            });
        }
        visible.value = true;
    };

    let def = [
        {
            field: 'name',
            label: '名称',
            as: 'input',
            rules: Yup.string().required()
        },
        {
            field: 'permission_type',
            label: '类型',
            as: 'select',
            outputFormat: (row: any) => {
                return Number(row.value);
            },
            props: {
                options: permissionTypeOptions
            },
            rules: Yup.string().required()
        },
        {
            field: 'code',
            label: 'Code',
            as: 'input',
            rules: Yup.string().required()
        },
        {
            field: 'description',
            label: '描述',
            as: 'textarea',
            rules: Yup.string().required()
        }
    ];

    const getPermissionTypeOptions = () => {
        axios
            .get({
                url: '/dic/list',
                params: {
                    page: 1,
                    limit: -1,
                    pids: 327
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    permissionTypeOptions.value = res.data.map((e: any) => {
                        return {
                            ...e,
                            label: e.name,
                            value: String(e.id)
                        };
                    });
                }
            });
    };

    getPermissionTypeOptions();

    const options = ref(def);

    defineExpose({ open });
</script>

<template>
    <lew-modal
        v-model:visible="visible"
        width="380px"
        :title="`${permission_id ? '更新' : '新建'}角色`"
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
