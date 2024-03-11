<script lang="ts" setup name="table-turbo">
    import axios from '@/axios/http';

    const props = defineProps({
        options: {
            type: Array,
            default: () => []
        },
        searchOptions: {
            type: Array,
            default: () => []
        },
        sortOptions: {
            type: Array,
            default: () => []
        },
        apiPath: {
            type: String,
            default: ''
        },
        initSearch: {
            type: Boolean,
            default: true
        },
        baseURL: {
            type: String,
            default: ''
        },
        checkable: {
            type: Boolean,
            default: false
        },
        singleSelect: {
            type: Boolean,
            default: false
        }
    });

    const list: any = ref([]);
    const total: any = ref(0);
    const loading = ref(true);
    const page = ref(1);
    const limit = ref(10);
    const searchForm = ref<any>({});
    const tableRef = ref();

    const getList = () => {
        loading.value = true;
        axios
            .get({
                url: props.apiPath,
                baseURL: props.baseURL || undefined,
                params: {
                    page: page.value,
                    limit: limit.value,
                    ...params_backup.value,
                    ...searchForm.value
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    list.value = res.data;
                    total.value = res.total;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const changPage = () => {
        getList();
    };

    const params_backup = ref({});

    const init = (params: any = {}) => {
        page.value = 1;
        limit.value = 10;
        params_backup.value = params;
        getList();
    };

    const reset = () => {
        searchForm.value = {};
        init();
    };
    const search = () => {
        getList();
    };

    onMounted(() => {
        if (props.initSearch) {
            init();
        }
    });

    const setSelectedKeys = (keys: any) => {
        tableRef.value.setSelectedKeys(keys);
    };

    const getSelectedKeys = () => {
        return tableRef.value.getSelectedKeys();
    };

    defineExpose({ init, setSelectedKeys, getSelectedKeys });
</script>

<template>
    <lew-flex style="width: 100%" class="table-turbo" direction="y" gap="20px" x="end">
        <lew-flex mode="between" class="search-box">
            <lew-flex
                v-if="(searchOptions || []).length > 0"
                x="start"
                y="start"
                class="filter-panel"
                gap="20px"
            >
                <div class="filter-form">
                    <template v-for="item in (searchOptions as any)" :key="item.field">
                        <lew-flex x="start" class="item">
                            <lew-input
                                v-if="item.type === 'input'"
                                v-model="searchForm[item.field]"
                                :disabled="loading"
                                style="width: 100%"
                                ok-by-enter
                                v-bind="item"
                                @ok="search"
                            />
                            <lew-select
                                v-if="item.type === 'select'"
                                v-model="searchForm[item.field]"
                                v-bind="item"
                                :disabled="loading"
                                style="width: 100%"
                            />
                        </lew-flex>
                    </template>
                    <div class="filter-actions">
                        <lew-button round type="light" :disabled="loading" @click="search">
                            搜索
                        </lew-button>
                        <lew-button
                            round
                            color="gray"
                            :disabled="loading"
                            type="light"
                            @click="reset"
                        >
                            重置
                        </lew-button>
                    </div>
                </div>

                <slot name="search-action" />
            </lew-flex>
        </lew-flex>
        <lew-flex v-loading="{ visible: loading }">
            <lew-table
                ref="tableRef"
                :data-source="list"
                :checkable="checkable"
                :single-select="singleSelect"
                :columns="options"
            >
                <template v-for="(item, key, index) in $slots" :key="index" #[key]="{ row }">
                    <slot :name="key" :row="row"></slot>
                </template>
            </lew-table>
        </lew-flex>
        <lew-pagination
            v-if="total > 0"
            v-model:current-page="page"
            v-model:pageSize="limit"
            :disabled="loading"
            :total="total || 0"
            @change="changPage"
        >
            <template #left>
                <div v-if="total" style="margin-left: 10px"> 共 {{ total }} 条 </div>
            </template>
        </lew-pagination>
    </lew-flex>
</template>

<style lang="scss" scoped>
    .filter-panel {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        margin-top: 2px;
        .filter-actions {
            display: flex;
            gap: 10px;
            margin-top: 2px;
        }
        .filter-form {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-top: -2px;
        }

        .header {
            padding: 10px 15px;
            border-bottom: 1px var(--lew-bgcolor-3) solid;
            font-weight: bold;
        }

        .footer {
            padding: 15px;
            border-top: 1px var(--lew-bgcolor-3) solid;
        }
    }
</style>
