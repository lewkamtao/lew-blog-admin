<script lang="ts" setup>
    import axios from '@/axios/http';
    import * as Yup from 'yup';

    let state = reactive<{
        visible: boolean;
        role_id?: number;
        user_id?: number;
    }>({
        visible: false,
        role_id: undefined,
        user_id: undefined
    });

    const options = ref([
        {
            field: 'input', // 字段名
            label: '文本框', // 标签
            as: 'input', // 组件
            rules: Yup.string().required('不能为空'), // 校验规则
            props: {
                // 组件props
                showCount: true,
                maxLength: 30
            }
        }
    ]);

    let roleOptions = ref([] as any);
    let loading = ref(false);

    const getList = () => {
        loading.value = true;
        axios
            .get({
                url: '/role/list',
                params: {
                    page: 1,
                    limit: -1
                }
            })
            .then((res: any) => {
                loading.value = false;
                if (res.code == 200) {
                    roleOptions.value = res.data.map((e: any) => {
                        return {
                            ...e,
                            label: e.name,
                            value: String(e.id)
                        };
                    });
                }
            });
    };

    const open = ({ user_id, role_id }: { user_id: number; role_id: number }) => {
        state.user_id = user_id;
        state.role_id = role_id;
        state.visible = true;
        getList();
    };

    defineExpose({ open });
</script>

<template>
    <lew-modal
        v-model:visible="state.visible"
        title="设置角色"
        width="360px"
        @cancel="state.visible = false"
        @close="state.visible = false"
    >
        <template #main>
            <div v-loading="{ isShow: loading }" class="modal-body">
                <lew-form :options="options" direction="x" label-width="60px"> </lew-form>
            </div>
        </template>
    </lew-modal>
</template>

<style lang="scss" scoped>
    .modal-body {
        padding: 30px;
    }
</style>
