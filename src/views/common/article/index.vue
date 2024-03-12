<script lang="ts" setup>
    import TableTurbo from '@/components/TableTurbo.vue';
    import axios from '@/axios/http';

    const columns = [
        {
            title: 'id',
            width: 80,
            field: 'id',
            fixed: 'left',
            x: 'center'
        },
        {
            title: '文章标题',
            width: 250,
            fixed: 'left',
            field: 'title'
        },
        {
            title: '系列',
            width: 120,
            field: 'series'
        },
        {
            title: '标签',
            width: 220,
            field: 'tags'
        },
        {
            title: '状态',
            width: 120,
            field: 'is_publish'
        },
        {
            title: '访客',
            width: 120,
            field: 'view_num',
            x: 'end'
        },
        {
            title: '评论',
            width: 120,
            field: 'comment_num',
            x: 'end'
        },
        {
            title: '最后修改时间',
            width: 200,
            field: 'updated_at',
            x: 'end'
        },
        {
            title: '操作',
            width: 200,
            fixed: 'right',
            field: 'action',
            x: 'end'
        }
    ];

    const searchOptions = [
        {
            placeholder: '文章标题',
            type: 'input',
            clearable: true,
            field: 'title'
        },
        {
            placeholder: '发布状态',
            type: 'select',
            clearable: true,
            field: 'is_publish',
            options: [
                { label: '已发布', value: 1 },
                { label: '草稿', value: 0 }
            ]
        }
    ];

    const router = useRouter();
    const tableTurboRef = ref();

    const toDetail = (id: number) => {
        router.push('/common/article/detail/' + id);
    };

    const toEdit = (id: number) => {
        router.push('/creation/writing?id=' + id);
    };

    const deleteArticle = (item: any) => {
        LewDialog.error({
            title: '警告',
            okText: '删除',
            content: '你是否要删除该文章，此操作会立即生效且不可恢复，请谨慎操作！',
            closeOnClickOverlay: true,
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .delete({
                            url: `/article/${item.id}`
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                resolve(true);
                                LewMessage.success({
                                    content: '删除成功！'
                                });
                                tableTurboRef.value.refresh();
                            } else {
                                resolve(false);
                            }
                        });
                });
            }
        });
    };

    const changeArticle = (row: any) => {
        const { is_publish, id } = row;
        if (is_publish) {
            LewDialog.warning({
                title: '提示',
                okText: '下架',
                content: '你是否要下架该文章，此操作会立即生效，请确认！',
                closeOnClickOverlay: true,
                ok: () => {
                    return new Promise((resolve) => {
                        axios
                            .put({
                                url: `/article/${id}`,
                                data: {
                                    is_publish: false
                                }
                            })
                            .then((res: any) => {
                                if (res.code == 200) {
                                    resolve(true);
                                    LewMessage.success({
                                        content: '已下架！'
                                    });
                                    tableTurboRef.value.refresh();
                                } else {
                                    resolve(false);
                                }
                            });
                    });
                }
            });
        } else {
            LewDialog.info({
                title: '提示',
                okText: '发布',
                content: '你是否要发布该文章，此操作会立即生效，请确认！',
                closeOnClickOverlay: true,
                ok: () => {
                    return new Promise((resolve) => {
                        axios
                            .put({
                                url: `/article/${id}`,
                                data: {
                                    is_publish: true
                                }
                            })
                            .then((res: any) => {
                                if (res.code == 200) {
                                    resolve(true);
                                    LewMessage.success({
                                        content: '已发布！'
                                    });
                                    tableTurboRef.value.refresh();
                                } else {
                                    resolve(false);
                                }
                            });
                    });
                }
            });
        }
    };
</script>

<template>
    <div class="table-page">
        <table-turbo
            ref="tableTurboRef"
            api-path="/article/list"
            base-u-r-l="/api_blog"
            :options="columns"
            :search-options="searchOptions"
        >
            <template #search-action>
                <lew-button icon="edit" round @click="router.push('/creation/writing')">
                    写文章
                </lew-button>
            </template>
            <template #series="{ row }">
                {{ row.series.title }}
            </template>
            <template #tags="{ row }">
                <lew-tag
                    v-for="(item, index) in row.tags"
                    :key="index"
                    type="light"
                    round
                    color="teal"
                    size="small"
                >
                    {{ item.title }}
                </lew-tag>
            </template>
            <template #is_publish="{ row }">
                <lew-flex class="publish-tag" x="start" @click="changeArticle(row)">
                    <lew-badge round :color="row.is_publish ? 'green' : 'gray'" />
                    {{ row.is_publish ? '已发布' : '草稿' }}
                </lew-flex>
            </template>
            <template #action="{ row }">
                <lew-button size="small" round type="text" @click="toEdit(row.id)">
                    编辑
                </lew-button>
                <lew-button size="small" round type="text" @click="toDetail(row.id)">
                    详情
                </lew-button>
                <lew-button size="small" color="red" round type="text" @click="deleteArticle(row)">
                    删除
                </lew-button>
            </template>
        </table-turbo>
    </div>
</template>

<style lang="scss">
    .table-page {
        padding: 20px;
        box-sizing: border-box;
    }
    .publish-tag {
        margin-left: 5px;
        cursor: pointer;
        font-size: 13px;
    }
</style>
