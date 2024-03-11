<script lang="ts" setup>
    import RoleList from './RoleList.vue';
    import TableTurbo from '@/components/TableTurbo.vue';
    import AddRoleUserModal from './AddRoleUserModal.vue';

    defineProps({
        roleList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    });

    let role_id = ref<number>(undefined as any);
    const addRoleUserModal = ref();

    const columns = [
        {
            title: 'id',
            width: 80,
            field: 'id',
            x: 'center',
            fixed: 'left'
        },
        {
            title: '昵称',
            width: 250,
            field: 'nickname'
        },
        {
            title: '创建时间',
            width: 200,
            field: 'created_at'
        },
        {
            title: '操作',
            width: 205,
            fixed: 'right',
            field: 'action',
            x: 'end'
        }
    ];

    const searchOptions = [
        {
            label: '应用名称',
            type: 'input',
            field: 'name'
        },
        {
            label: '状态',
            type: 'select',
            field: 'status',
            options: [
                { label: '正常', value: '1' },
                { label: '异常', value: '2' }
            ]
        }
    ];
    const router = useRouter();
    const tableTurboRef = ref();
    const roleListRef = ref();
    const toDetail = (item: any) => {
        router.push('/user/list/detail/' + item.id);
        toDetail;
    };
</script>

<template>
    <div class="role-user-wrapper">
        <div class="header">
            <lew-title>角色用户配置</lew-title>
            <p>资源配置按照角色进行分配，可以管理不同角色拥有的权限。</p>
        </div>
        <lew-flex y="start" gap="20px">
            <div class="app-menu">
                <role-list
                    ref="roleListRef"
                    v-model="role_id"
                    :list="roleList"
                    title="角色列表"
                    @change="tableTurboRef.init({ role_id: role_id })"
                />
            </div>
            <div class="user-list">
                <table-turbo
                    v-show="role_id"
                    ref="tableTurboRef"
                    api-path="/role_user/list"
                    :options="columns"
                    :search-options="searchOptions"
                >
                    <template #search-action>
                        <lew-button icon="plus" round @click="addRoleUserModal.open(role_id)">
                            添加用户
                        </lew-button>
                    </template>
                    <template #nickname="{ row }">
                        <lew-flex style="width: 200px" gap="10px" x="start">
                            <lew-avatar
                                :key="row.avatar"
                                round
                                style="width: 40px"
                                :src="row.avatar"
                            />
                            <lew-text-trim style="width: 140px" :text="row.nickname" />
                        </lew-flex>
                    </template>
                    <template #action="{ row }">
                        <lew-button type="text" @click="toDetail(row)"> Detail </lew-button>
                    </template>
                </table-turbo>
                <lew-empty v-show="!role_id" type="order" title="请先设置角色"></lew-empty>
            </div>
            <AddRoleUserModal
                ref="addRoleUserModal"
                @success="tableTurboRef.init({ role_id: role_id })"
            />
        </lew-flex>
    </div>
</template>

<style lang="scss" scoped>
    .role-user-wrapper {
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        background-color: var(--lew-bgcolor-0);
        .header {
            padding: 20px;
            margin-bottom: 20px;
            background-color: var(--lew-bgcolor-1);
        }
        .app-menu {
            width: 250px;
        }

        .user-list {
            width: calc(100% - 250px);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            min-height: 280px;
        }
    }
</style>
