<script lang="ts" setup>
    import axios from '@/axios/http';
    let visible = ref(false);

    let editId = ref('');
    let form = ref({
        name: '',
        description: ''
    });

    const emit = defineEmits(['updated']);

    const add = () => {
        if (!visible.value) {
            return;
        }
        return new Promise((resolve) => {
            axios
                .post({
                    url: '/role',
                    data: form.value
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        LewMessage.success('添加成功');
                        visible.value = false;
                        emit('updated');
                    }
                    resolve(true);
                });
        });
    };

    const put = () => {
        return new Promise((resolve) => {
            axios
                .put({
                    url: `/role/${editId.value}`,
                    data: form.value
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        LewMessage.success('添加成功');
                        emit('updated');
                        visible.value = false;
                    }
                    resolve(true);
                });
        });
    };

    const openModal = () => {
        form.value = {
            name: '',
            description: ''
        };
        visible.value = true;
    };

    const openUpdatedModal = (row: any) => {
        editId.value = row.id;
        form.value = {
            name: row.name,
            description: row.description
        };
        visible.value = true;
    };

    defineExpose({ openUpdatedModal });
</script>

<template>
    <lew-button style="margin-bottom: 15px" @click="openModal">
        <lew-icon style="margin-right: 5px" size="16" type="user-plus" /> 创建角色
    </lew-button>

    <lew-modal :visible="visible" width="360px">
        <div class="modal-body">
            <lew-form direction="x" label-width="60px">
                <lew-title :bold="800" size="16px"
                    >{{ editId ? '更新' : '添加' }}权限资源
                </lew-title>
                <lew-form-item label="角色名称">
                    <lew-input v-model="form.name" />
                </lew-form-item>
                <lew-form-item label="角色描述">
                    <lew-input v-model="form.description" type="textarea" />
                </lew-form-item>
                <lew-flex x="end">
                    <lew-button type="normal" @click="visible = false">关闭 </lew-button>
                    <lew-button v-if="editId" :request="put">更新</lew-button>
                    <lew-button v-else :request="add">提交</lew-button>
                </lew-flex>
            </lew-form>
        </div>
    </lew-modal>
</template>

<style lang="scss" scoped>
    .modal-body {
        padding: 30px;
    }
</style>
