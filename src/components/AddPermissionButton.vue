<script lang="ts" setup>
    import axios from '@/axios/http';

    let visible = ref(false);

    const permission_typeOptions = ref([]);
    const appOptions = ref([]);

    let form = ref({
        permission_type: '',
        code: '',
        name: '',
        description: '',
        app_id: ''
    });
    let editId = ref('');

    const props = defineProps({
        permission_type: {
            type: String,
            default: ''
        },
        app_id: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['updated']);

    const add = () => {
        let _data = {
            ...form.value,
            app_id: parseInt(form.value.app_id),
            permission_type: parseInt(form.value.permission_type)
        };

        axios
            .post({
                url: '/permission',
                data: _data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('添加成功');
                    emit('updated');
                    visible.value = false;
                }
            });
    };

    const put = () => {
        let _data = {
            ...form.value,
            app_id: parseInt(form.value.app_id),
            permission_type: parseInt(form.value.permission_type)
        };

        axios
            .put({
                url: `/permission/${editId.value}`,
                data: _data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('添加成功');
                    emit('updated');
                    visible.value = false;
                }
            });
    };

    const openModal = () => {
        form.value = {
            permission_type: props.permission_type,
            code: '',
            name: '',
            description: '',
            app_id: props.app_id
        };
        visible.value = true;
    };

    const openUpdatedModal = (row: any) => {
        form.value = {
            permission_type: String(row.permission_type),
            code: String(row.code),
            name: row.name,
            description: row.description,
            app_id: String(row.app_id)
        };
        editId.value = row.id;
        visible.value = true;
    };

    defineExpose({ openUpdatedModal });

    const getAppOptions = () => {
        axios
            .get({
                url: '/app/list?page=1&limit=2000'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    appOptions.value = res.data.map((e: any) => {
                        return {
                            ...e,
                            label: e.name,
                            value: String(e.id)
                        };
                    });
                }
            });
    };

    const getpermission_typeOptions = () => {
        axios
            .get({
                url: '/dic/list?page=1&limit=2000&pids=327'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    permission_typeOptions.value = res.data.map((e: any) => {
                        return {
                            ...e,
                            label: e.name,
                            value: String(e.id)
                        };
                    });
                }
            });
    };

    onMounted(() => {
        getpermission_typeOptions();
        getAppOptions();
    });
</script>

<template>
    <lew-button style="margin-bottom: 15px" @click="openModal">
        <lew-icon style="margin-right: 5px" size="16" type="plus-circle" /> 添加
    </lew-button>

    <lew-modal :visible="visible" width="360px">
        <div class="modal-body">
            <lew-form direction="x" label-width="50px">
                <lew-title :bold="800" size="16px"
                    >{{ editId ? '更新' : '添加' }}权限资源
                </lew-title>
                <lew-form-item label="名称">
                    <lew-input v-model="form.name" />
                </lew-form-item>
                <lew-form-item label="应用">
                    <lew-select v-model="form.app_id" :options="appOptions" />
                </lew-form-item>
                <lew-form-item label="类型">
                    <lew-select v-model="form.permission_type" :options="permission_typeOptions" />
                </lew-form-item>
                <lew-form-item label="Code">
                    <lew-input v-model="form.code" />
                </lew-form-item>
                <lew-form-item label="描述">
                    <lew-input v-model="form.description" type="textarea" />
                </lew-form-item>
                <lew-flex x="end">
                    <lew-button type="normal" @click="visible = false">关闭 </lew-button>
                    <lew-button v-if="editId" @click="put">更新</lew-button>
                    <lew-button v-else @click="add">提交</lew-button>
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
