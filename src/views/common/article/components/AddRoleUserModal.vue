<script lang="ts" setup>
    import axios from '@/axios/http';
    import * as Yup from 'yup';
    import { lewSetForm } from 'lew-ui';
    let visible = ref(false);

    const formRef = ref();
    const role_id = ref<any>('');
    const emit = defineEmits(['success']);

    const ok = () => {
        return new Promise(async (resolve) => {
            if (!formRef.value) return;
            const vail = await formRef.value.validate();
            if (vail) {
                axios
                    .post({
                        url: '/user_role',
                        data: {
                            ...formRef.value.getForm(),
                            role_id: Number(role_id.value)
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
        });
    };

    const open = (id: any) => {
        role_id.value = id;
        lewSetForm({
            formRef: formRef,
            params: {}
        });
        visible.value = true;
    };

    const searchFn = (event: any) => {
        return new Promise((resolve) => {
            axios
                .get({
                    url: '/user/list',
                    params: {
                        page: 1,
                        limit: -1,
                        nickname: event.keyword
                    }
                })
                .then((res: any) => {
                    if (res.success) {
                        resolve(
                            res.data.map((e: any) => {
                                return {
                                    label: `${e.nickname || '-'}（${e.username || '-'}）`,
                                    value: e.id
                                };
                            })
                        );
                    } else {
                        resolve([]);
                    }
                });
        });
    };

    let def = [
        {
            field: 'user_id',
            label: '选择用户',
            as: 'select',
            rules: Yup.string().required(),
            props: {
                searchable: true,
                searchMethod: searchFn
            }
        }
    ];

    const options = ref(def);

    defineExpose({ open });
</script>

<template>
    <lew-modal
        v-model:visible="visible"
        width="380px"
        title="添加用户"
        :ok-props="{
            request: ok
        }"
        @cancel="visible = false"
    >
        <div class="modal-body">
            <lew-form ref="formRef" direction="y" :options="options" :label-width="80" />
        </div>
    </lew-modal>
</template>

<style lang="scss" scoped>
    .modal-body {
        padding: 30px;
    }
</style>
