<script lang="ts" setup name="common-app-detail">
    import axios from '@/axios/http';
    import DescTable from '@/components/DescTable.vue';

    const route = useRoute();

    const user = ref({} as any);
    const user_id = ref(route.params.id);
    const loading = ref(false);
    const getDetail = () => {
        loading.value = true;
        axios
            .get({
                url: `/user/${user_id.value}`
            })
            .then((res: any) => {
                if (res.code == 200) {
                    user.value = res.data;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const options = computed(() => {
        return [
            {
                label: '昵称',
                value: user.value.nickname,
                edit: () => {
                    console.log('1231');
                }
            },
            {
                label: '角色',
                slot: 'role'
            },
            {
                label: 'Email',
                value: user.value.email || '-'
            },
            {
                label: '帐号状态',
                slot: 'status'
            },
            {
                label: '描述',
                value: user.value.description || '-'
            },
            {
                label: '创建时间',
                value: user.value.created_at || '-'
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

    onMounted(() => {
        getDetail();
    });
</script>

<template>
    <div class="app-detail-wrapper">
        <div v-loading="{ visible: loading }" class="left">
            <lew-avatar
                v-if="user.avatar"
                style="margin-bottom: 30px"
                width="100px"
                height="100px"
                round
                :src="user.avatar"
            ></lew-avatar>
            <DescTable :options="options">
                <template #role>
                    <lew-flex>
                        <lew-tag
                            v-for="(item, index) in (user.roles as any)"
                            :key="index"
                            round
                            type="light"
                        >
                            {{ item.name }}
                        </lew-tag>
                    </lew-flex>
                </template>
                <template #status>
                    <lew-flex style="margin-left: 5px">
                        <lew-badge round :color="statusMap[user.status]?.color" />
                        {{ statusMap[user.status]?.label }}
                    </lew-flex>
                </template>
            </DescTable>
            <lew-flex class="action" x="end"> </lew-flex>
        </div>
        <div v-loading="{ visible: loading }" class="right">
            <div class="info"> </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .app-detail-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        .left {
            padding: 30px;
            background-color: var(--lew-bgcolor-0);
            width: 70%;
        }
        .right {
            padding: 30px;
            background-color: var(--lew-bgcolor-0);
            width: 30%;
            .info {
                height: 300px;
                width: 100%;
            }
        }
        .action {
            padding: 20px;
            display: flex;
            background-color: var(--lew-bgcolor-1);
            margin-top: 30px;
        }
    }
</style>
