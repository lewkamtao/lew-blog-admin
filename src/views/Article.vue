<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    let data: any = ref([]);
    let total = ref<number>(0);
    let pageNum = ref(1);
    let pageSize = ref(20);

    const getArticle = () => {
        axios
            .get({
                url: '/article/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    data.value = res.data;
                    total.value = res.total;
                }
            });
    };

    onMounted(() => {
        getArticle();
    });

    const columns = [
        {
            title: 'id',
            width: '100px',
            field: 'id',
            x: 'center'
        },
        {
            title: '系列',
            width: '180px',
            field: 'seriesTitle'
        },
        {
            title: '标题',
            width: '180px',
            field: 'title'
        },

        {
            title: '标签',
            width: '220px',
            field: 'tags'
        },
        {
            title: '内容',
            width: '550px',
            field: 'content',
            x: 'start'
        },
        {
            title: '最后更新时间',
            width: '200px',
            field: 'updated_at',
            x: 'start'
        },
        {
            title: '创建时间',
            width: '200px',
            field: 'created_at',
            x: 'start'
        },
        {
            title: '管理',
            width: '140px',
            field: 'action',
            sticky: 'right',
            offsetX: '0px',
            x: 'center'
        }
    ];

    const delOk = (e: any, id: number) => {
        axios
            .delete({
                url: '/article/' + id
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('删除成功');
                    getArticle();
                }
            });
        e.hide();
    };

    const delCancel = (e: any) => {
        e.hide();
    };

    const toEdit = (id: number) => {
        router.push('/AddArticle?id=' + id);
    };
</script>

<template>
    <div class="article-wrapper">
        <lew-flex gap="20px" x="start" class="header">
            <lew-button @click="router.push('/AddArticle')">写文章</lew-button>
        </lew-flex>
        <lew-table :data="data" :columns="columns">
            <template #id="{ row }"> {{ row.id }} </template>
            <template #tags="{ row }">
                <lew-flex wrap x="start" gap="5px">
                    <lew-tag
                        size="small"
                        type="primary"
                        v-for="(item, index) in row.tags"
                        :key="index"
                        >{{ item.title }}</lew-tag
                    ></lew-flex
                >
            </template>
            <template #title="{ row }">
                {{ row.title }}
            </template>
            <template #seriesTitle="{ row }">
                <lew-tag type="success">{{ row.series?.title }}</lew-tag>
            </template>
            <template #content="{ row }">
                {{ row.content }}
            </template>
            <template #updated_at="{ row }">
                {{ row.updated_at }}
            </template>
            <template #created_at="{ row }">
                {{ row.created_at }}
            </template>
            <template #action="{ row }">
                <lew-flex>
                    <lew-button @click="toEdit(row.id)" is-text>编辑</lew-button>
                    <lew-popok
                        title="删除确认"
                        content="删除之后无法恢复，请确认！"
                        placement="top"
                        width="200px"
                        @ok="delOk($event, row.id)"
                        @cancel="delCancel"
                    >
                        <lew-button is-text type="error">删除</lew-button>
                    </lew-popok>
                </lew-flex>
            </template>
        </lew-table>
        <div style="margin: 20px 0px 0px 20px; padding-bottom: 30px">
            <lew-pagination
                v-model:page-num="pageNum"
                v-model:page-size="pageSize"
                :page-size-options="[
                    {
                        label: '10 / 页',
                        value: 10
                    },
                    {
                        label: '20 / 页',
                        value: 20
                    },
                    {
                        label: '30 / 页',
                        value: 30
                    }
                ]"
                :page-num="pageNum"
                :total="total"
            />
        </div>
    </div>
</template>
<style>
    .popover-body {
        padding: 10px;
    }
</style>
<style lang="scss" scoped>
    .article-wrapper {
        .header {
            padding: 30px;
        }
    }
    .info {
        line-height: 22px;
        padding: 10px 0px;
        .lew-avatar {
            flex-shrink: 0;
            width: 35px;
            height: 35px;
        }
        .right {
            flex-shrink: 0;
            width: calc(100% - 50px);
        }
        .name {
            font-weight: bold;
        }
        .mail {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            white-space: nowrap;
            color: var(--lew-text-color-9);
        }
    }
</style>
