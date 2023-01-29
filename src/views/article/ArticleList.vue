<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';
    import { dateFormat, parseGetParams } from '@/utils';

    const columns = [
        {
            title: '标题',
            width: '280px',
            field: 'title'
        },
        {
            title: '系列',
            width: '120px',
            field: 'series'
        },
        {
            title: '标签',
            width: '250px',
            field: 'tags'
        },
        {
            title: '状态',
            width: 'auto',
            x: 'center',
            field: 'status'
        },
        {
            title: '访客',
            width: '80px',
            x: 'center',
            field: 'view_num'
        },
        {
            title: '评论',
            width: '80px',
            x: 'center',
            field: 'comment_num'
        },
        {
            title: '最后修改时间',
            field: 'updated_at',
            width: '180px'
        },
        {
            title: '操作',
            width: '300px',
            field: 'action',
            sticky: 'right'
        }
    ];

    const props = defineProps({
        mode: {
            type: String,
            default: 'all'
        }
    });

    const router = useRouter();
    const pageNum: any = ref(1);
    const pageSize: any = ref(10);
    const list: any = ref([]);
    const total = ref<number>(0);
    const loading = ref(false);

    watch(
        () => props.mode,
        () => {
            pageNum.value = 1;
            getArticle();
        }
    );

    const getArticle = () => {
        loading.value = true;
        let params: any = {
            page: pageNum.value,
            limit: pageSize.value
        };
        switch (props.mode) {
            case 'all':
                break;
            case 'publish':
                params.is_publish = true;
                break;
            case 'draft':
                params.is_publish = false;
                break;
            default:
                break;
        }
        axios
            .get({
                url: `/api/article/list?${parseGetParams(params)}`
            })
            .then((res: any) => {
                if (res.code == 200) {
                    list.value = res.data;
                    total.value = res.total | 0;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const del = (id: number) => {
        LewDialog.warning({
            title: '删除确认',
            content: '你是否要删除该账号',
            closeOnClickOverlay: true,
            layout: 'easy',
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .delete({
                            url: '/api/article/' + id
                        })
                        .then((res: any) => {
                            resolve(true);
                            if (res.code == 200) {
                                LewMessage.success('删除成功');
                                getArticle();
                            }
                        });
                });
            }
        });
    };

    const edit = (id: number) => {
        router.push('/AddArticle?id=' + id);
    };

    const publish = (id: any) => {
        LewDialog.success({
            title: '发布确认',
            content: '确定发布此文章？',
            closeOnClickOverlay: true,
            layout: 'easy',
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .put({
                            url: '/api/article/' + id,
                            data: {
                                is_publish: true
                            }
                        })
                        .then((res: any) => {
                            resolve(true);
                            if (res.code == 200) {
                                LewMessage.success('发布成功');
                                getArticle();
                            }
                        });
                });
            }
        });
    };

    const draft = (id: any) => {
        LewDialog.warning({
            title: '下架确认',
            content: '确认下架此文章？',
            closeOnClickOverlay: true,
            layout: 'easy',
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .put({
                            url: '/api/article/' + id,
                            data: {
                                is_publish: false
                            }
                        })
                        .then((res: any) => {
                            resolve(true);
                            if (res.code == 200) {
                                LewMessage.success('下架成功');
                                getArticle();
                            }
                        });
                });
            }
        });
    };

    const view = (id: any) => {
        console.log(id);
    };

    onMounted(() => {
        getArticle();
    });
</script>

<template>
    <lew-table :data="list" :columns="columns">
        <template #title="{ row }"> {{ row.title }} </template>
        <template #series="{ row }">
            {{ row.series.title }}
        </template>
        <template #tags="{ row }">
            <lew-tag v-for="(item, index) in row.tags" :key="index" type="primary">
                {{ item.title }}
            </lew-tag>
        </template>
        <template #view_num="{ row }"> {{ row.view_num }} </template>
        <template #like_num="{ row }"> {{ row.like_num }} </template>
        <template #comment_num="{ row }"> {{ row.comment_num }} </template>
        <template #updated_at="{ row }"> {{ dateFormat(row.updated_at) }} </template>
        <template #status="{ row }">
            <lew-flex>
                <lew-tag v-if="row.is_publish" type="success">已发布</lew-tag>
                <lew-tag v-if="!row.is_publish" type="normal">草稿</lew-tag>
            </lew-flex>
        </template>
        <template #action="{ row }">
            <lew-flex x="start" style="margin-left: -5px">
                <lew-button v-if="mode != 'del'" is-text size="small" @click="edit(row.id)">
                    编辑
                </lew-button>
                <lew-button
                    v-if="!row.is_publish"
                    type="success"
                    is-text
                    size="small"
                    @click="publish(row.id)"
                >
                    发布
                </lew-button>
                <lew-button
                    v-if="row.is_publish"
                    type="error"
                    is-text
                    size="small"
                    @click="draft(row.id)"
                >
                    下架
                </lew-button>
                <lew-button
                    v-if="!row.is_publish"
                    type="error"
                    is-text
                    size="small"
                    @click="del(row.id)"
                >
                    删除
                </lew-button>
                <lew-button is-text size="small" type="normal" @click="view(row.id)">
                    查看详情
                </lew-button>
            </lew-flex>
        </template>
    </lew-table>
    <br />
    <lew-flex x="start">
        <lew-pagination
            :total="total"
            round
            :page-show-size="3"
            v-model:page-num="pageNum"
            v-model:page-size="pageSize"
            @change="getArticle"
        ></lew-pagination>
        <div class="sub-title"> 共 {{ total }} 条记录 </div>
    </lew-flex>
</template>

<style lang="scss" scoped>
    .sub-title {
        color: var(--lew-text-color-8);
    }
</style>
