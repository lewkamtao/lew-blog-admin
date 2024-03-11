<script lang="ts" setup>
    import axios from '@/axios/http';
    import * as Yup from 'yup';
    import { lewSetForm } from 'lew-ui';
    let visible = ref(false);

    const formRef = ref();
    const role_id = ref<any>('');
    const _app_id = ref<any>('');
    const emit = defineEmits(['success']);

    const ok = () => {
        return new Promise(async (resolve) => {
            if (!formRef.value) return;
            const vail = await formRef.value.validate();
            if (vail) {
                if (role_id.value) {
                    axios
                        .put({
                            url: `/role/${role_id.value}`,
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
                            url: '/role',
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
        { id, name, description, app_id } = {
            app_id: undefined,
            id: undefined,
            name: undefined,
            description: undefined
        }
    ) => {
        _app_id.value = app_id;
        if (id) {
            role_id.value = id;
            lewSetForm({
                formRef: formRef,
                params: { name, description }
            });
        } else {
            role_id.value = '';
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
            field: 'description',
            label: '角色描述',
            as: 'textarea',
            rules: Yup.string().required()
        }
    ];

    const options = ref(def);

    defineExpose({ open });
</script>

<template>
    <lew-modal
        v-model:visible="visible"
        width="380px"
        :title="`${role_id ? '更新' : '新建'}角色`"
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
