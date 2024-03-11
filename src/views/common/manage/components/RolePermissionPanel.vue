<script lang="ts" setup>
    import axios from '@/axios/http';
    import RoleList from './RoleList.vue';
    import PermissionModal from './PermissionModal.vue';
    import _ from 'lodash';

    defineProps({
        roleList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    });

    const route = useRoute();

    let permissionTypeList = ref([] as any);

    const { id } = route.params;

    let role_id = ref<number>(undefined as any);

    let hasPermissionValue = ref([]);
    let loading = ref(false);
    const permissionModalRef = ref();

    const getAppPermissionList = () => {
        loading.value = true;
        axios
            .get({
                url: '/permission/list',
                params: {
                    app_id: id,
                    page: 1,
                    limit: -1
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    let list = res.data.map((e: any) => {
                        return {
                            ...e,
                            label: e.name,
                            value: e.id
                        };
                    });
                    permissionTypeList.value = permissionTypeList.value.map((e: any) => {
                        return {
                            ...e,
                            permissionList:
                                list
                                    .filter((p: any) => p.permission_type == e.id)
                                    .map((e: any) => {
                                        return {
                                            label: e.name,
                                            value: e.id
                                        };
                                    }) || []
                        };
                    });
                    if (!role_id.value) {
                        return;
                    }
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const getRolePermissionList = () => {
        // 获取角色权限列表
        loading.value = true;
        axios
            .get({
                url: '/role_permission/list',
                params: {
                    role_id: role_id.value,
                    app_id: id,
                    page: 1,
                    limit: -1
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    hasPermissionValue.value = _.uniq(
                        res.data.map((e: any) => {
                            return e.permission_id;
                        })
                    );
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const getPermissionTypeList = () => {
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
                    permissionTypeList.value = res.data;
                    getAppPermissionList();
                }
            });
    };

    onMounted(() => {
        getPermissionTypeList();
    });

    // 删除角色权限
    const deleteRolePermission = (permission_id: string) => {
        axios.delete({
            url: `/role_permission/${role_id.value}/${permission_id}`
        });
    };
    // 创建角色权限
    const createRolePermission = (permission_id: string) => {
        axios.post({
            url: '/role_permission',
            data: {
                role_id: role_id.value,
                permission_id: permission_id
            }
        });
    };

    // 更改角色权限
    const changePermission = ({ item }: any) => {
        if (hasPermissionValue.value.includes(item.value as never)) {
            createRolePermission(item.value);
        } else {
            deleteRolePermission(item.value);
        }
    };
</script>

<template>
    <div class="permission-wrapper">
        <div class="header">
            <lew-title>角色权限分配</lew-title>
            <p>资源配置按照角色进行分配，可以管理不同角色拥有的权限。</p>
        </div>
        <lew-flex y="start" gap="20px">
            <div class="app-menu">
                <role-list
                    key="rolePermission"
                    v-model="role_id"
                    :list="roleList"
                    title="角色列表"
                    @change="getRolePermissionList()"
                />
            </div>
            <div class="permission-list">
                <template v-if="role_id">
                    <lew-flex mode="between" y="center" class="header">
                        <lew-title style="margin-bottom: 0px" size="16" bold="600"
                            >权限资源</lew-title
                        >
                        <lew-button
                            icon="plus"
                            round
                            @click="permissionModalRef.open({ app_id: id })"
                        >
                            添加权限
                        </lew-button>
                    </lew-flex>
                    <lew-flex
                        v-loading="{ visible: loading }"
                        x="start"
                        direction="y"
                        gap="0px"
                        class="permission-box"
                    >
                        <div
                            v-for="(item, index) in permissionTypeList"
                            :key="index"
                            class="permission-group"
                        >
                            <lew-title size="14px">{{ item.name }}</lew-title>
                            <lew-checkbox-group
                                v-if="item.permissionList?.length > 0"
                                v-model="hasPermissionValue"
                                size="large"
                                round
                                block
                                direction="x"
                                :options="item.permissionList"
                                @change="changePermission"
                            >
                            </lew-checkbox-group>
                            <div v-else class="not-list"> 暂无权限资源 </div>
                        </div>
                    </lew-flex>
                </template>
                <lew-empty v-else type="order" title="请先设置角色"></lew-empty>
            </div>
        </lew-flex>
        <permission-modal ref="permissionModalRef" @success="getAppPermissionList" />
    </div>
</template>

<style lang="scss" scoped>
    .permission-wrapper {
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        background-color: var(--lew-bgcolor-0);
        .header {
            padding: 20px;
            background-color: var(--lew-bgcolor-1);
            margin-bottom: 20px;
        }
        .app-menu {
            width: 250px;
        }

        .permission-list {
            width: calc(100% - 250px);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            min-height: 280px;
        }

        .permission-box {
            padding: 20px;
            min-height: 100px;
            border-radius: var(--lew-border-radius);
            overflow: hidden;
            margin-top: -40px;
        }

        .permission-group {
            width: 100%;
            overflow: hidden;
            padding: 20px 0px;
            box-sizing: border-box;
            border-bottom: var(--lew-form-border-width) var(--lew-form-border-color) solid;
        }

        .not-list {
            font-size: 14px;
            color: var(--lew-text-color-7);
        }
    }
</style>
