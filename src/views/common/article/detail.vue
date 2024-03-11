<script lang="ts" setup name="common-app-detail">
    import axios from '@/axios/http';
    import DescTable from '@/components/DescTable.vue';
    import AppModal from './components/AppModal.vue';
    import RolePermissionPanel from './components/RolePermissionPanel.vue';
    import RoleUserPanel from './components/RoleUserPanel.vue';

    const route = useRoute();

    const app = ref({} as any);
    const router = useRouter();
    const app_id = ref(route.params.id);
    const loading = ref(false);
    const appModalRef = ref();
    const getDetail = () => {
        loading.value = true;
        axios
            .get({
                url: `/app/${app_id.value}`
            })
            .then((res: any) => {
                if (res.code == 200) {
                    app.value = res.data;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const options = computed(() => {
        return [
            {
                label: '应用名称',
                value: app.value.name
            },
            {
                label: 'app_code',
                value: app.value.app_code
            },
            {
                label: '运行状态',
                slot: 'status'
            },
            {
                label: '应用描述',
                value: app.value.description || '-'
            },
            {
                label: '关键词',
                slot: 'keywords'
            },
            {
                label: '主页网址',
                slot: 'home_url'
            }
        ];
    });

    const statusMap: any = {
        101: {
            label: '运行中',
            color: 'green'
        },
        201: {
            label: '已暂停',
            color: 'red'
        },
        301: {
            label: '装修中',
            color: 'gray'
        }
    };

    const deleteApp = (item: any) => {
        LewDialog.error({
            title: '警告',
            okText: '销毁',
            content: '你是否要销毁该应用，此操作会立即生效且不可恢复，请谨慎操作！',
            closeOnClickOverlay: true,
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .delete({
                            url: `/app/${item.id}`
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                resolve(true);
                                LewMessage.success({
                                    content: '销毁成功！'
                                });
                                router.push('/common/app');
                            } else {
                                resolve(false);
                            }
                        });
                });
            }
        });
    };

    const stopApp = (item: any) => {
        LewDialog.error({
            title: '提示',
            okText: '临时关闭',
            content: '你是否要临时关闭该应用，此操作会拦截所有用户访问此站点。',
            closeOnClickOverlay: true,
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .put({
                            url: `/app/${item.id}`,
                            data: {
                                status: 201
                            }
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                resolve(true);
                                LewMessage.success({
                                    content: '临时关闭成功！'
                                });
                                getDetail();
                            } else {
                                resolve(false);
                            }
                        });
                });
            }
        });
    };

    const openApp = (item: any) => {
        LewDialog.info({
            title: '提示',
            okText: '开启站点',
            content: '你是否要开启站点该应用，此操作允许所有用户访问此站点。',
            closeOnClickOverlay: true,
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .put({
                            url: `/app/${item.id}`,
                            data: {
                                status: 101
                            }
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                resolve(true);
                                LewMessage.success({
                                    content: '开启站点成功！'
                                });
                                getDetail();
                            } else {
                                resolve(false);
                            }
                        });
                });
            }
        });
    };

    const getRolePermission = () => {
        axios
            .get({
                url: '/role/list',
                params: {
                    app_id: app_id.value
                }
            })
            .then((res: any) => {
                console.log(res);
            });
    };

    const goApp = (item: any) => {
        window.open(item.home_url);
    };

    const roleList = ref([]);

    const getRoleList = () => {
        return new Promise((resolve) => {
            axios
                .get({
                    url: '/role/list',
                    params: {
                        app_id: app_id.value,
                        page: 1,
                        limit: -1
                    }
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        roleList.value = res.data;
                        resolve(true);
                    }
                });
        });
    };
    provide('getRoleList', getRoleList);

    onMounted(() => {
        getRolePermission();
        getDetail();
    });
</script>

<template>
    <lew-flex class="app-detail" direction="y" gap="20px">
        <div class="app-detail-wrapper">
            <div v-loading="{ visible: loading }" class="left">
                <lew-avatar
                    style="margin-bottom: 30px"
                    width="100px"
                    height="100px"
                    round
                    :src="`https://api.lew.kamtao.com/manage/common/avatar/550/4B78CA/${app.name}`"
                ></lew-avatar>
                <desc-table :options="options">
                    <template #keywords>
                        <lew-flex v-if="app.keywords">
                            <lew-tag
                                v-for="(item, index) in app.keywords.split(',')"
                                :key="index"
                                size="small"
                                type="light"
                            >
                                {{ item }}
                            </lew-tag>
                        </lew-flex>
                        <div v-else>-</div>
                    </template>
                    <template #home_url>
                        <a
                            v-if="app.home_url"
                            class="home-link"
                            :href="app.home_url"
                            target="_blank"
                        >
                            {{ app.home_url }}
                        </a>
                        <div v-else>-</div>
                    </template>
                    <template #status>
                        <lew-flex style="margin-left: 5px">
                            <lew-badge round :color="statusMap[app.status]?.color" />
                            {{ statusMap[app.status]?.label }}
                        </lew-flex>
                    </template>
                </desc-table>
                <lew-flex class="action" x="end">
                    <lew-button
                        v-if="app.status === 101 && app.home_url"
                        type="light"
                        round
                        icon="navigation"
                        @click="goApp(app)"
                    >
                        访问
                    </lew-button>
                    <lew-button type="light" round icon="edit-2" @click="appModalRef.open(app)">
                        编辑
                    </lew-button>
                    <lew-button
                        v-if="app.status === 101"
                        type="light"
                        round
                        icon="power"
                        color="red"
                        @click="stopApp(app)"
                    >
                        临时关闭站点
                    </lew-button>
                    <lew-button
                        v-if="app.status === 201"
                        type="light"
                        round
                        icon="power"
                        color="blue"
                        @click="openApp(app)"
                    >
                        开启站点
                    </lew-button>
                    <lew-button
                        type="fill"
                        icon="trash-2"
                        round
                        color="red"
                        @click="deleteApp(app)"
                    >
                        销毁
                    </lew-button>
                </lew-flex>
            </div>
            <div v-loading="{ visible: loading }" class="right">
                <div class="info"> </div>
            </div>
        </div>

        <role-user-panel :role-list="roleList" />
        <role-permission-panel :role-list="roleList" />
        <app-modal ref="appModalRef" @success="getDetail" />
    </lew-flex>
</template>

<style lang="scss" scoped>
    .app-detail {
        background-color: var(--lew-bgcolor-2);
        padding: 20px;
    }
    .app-detail-wrapper {
        width: 100%;
        display: flex;
        gap: 20px;

        box-sizing: border-box;
        .left {
            padding: 30px;
            background-color: var(--lew-bgcolor-0);
            width: 50%;
        }
        .right {
            padding: 30px;
            background-color: var(--lew-bgcolor-0);
            width: 50%;
            .info {
                width: 100%;
            }
        }
        .home-link {
            text-decoration: underline;
        }
        .action {
            display: flex;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--lew-form-border-color);
        }
    }
</style>
