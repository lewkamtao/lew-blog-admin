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

    type Options = {
        label: string;
        value: string;
        activeIndex: number;
    };

    const options = ref([
        { label: '评论列表', value: '1' },
        { label: '留言板', value: '2' },
        { label: '好友', value: '3' },
        { label: '用户', value: '4' }
    ]);

    let value = ref('1');

    const change = (e: Options) => {
        console.log(e);
        LewMessage.info(e.label);
    };

    const columns = [
        {
            title: 'id',
            width: '100px',
            field: 'id',
            x: 'center'
        },
        {
            title: '标题',
            width: '180px',
            field: 'title'
        },
        {
            title: '内容',
            width: 'auto',
            field: 'content',
            x: 'start'
        }
    ];
</script>

<template>
    <div class="article-wrapper">
        <lew-flex gap="20px" x="start" class="header">
            <lew-tabs
                style="width: 100%"
                v-model="value"
                type="line"
                :options="options"
                @change="change"
            />
        </lew-flex>
        <lew-table :data="data" :columns="columns">
            <template #id="{ row }"> {{ row.id }} </template>
         
            <template #title="{ row }">
                {{ row.title }}
            </template>
            <template #content="{ row }">
                {{ row.content }}
            </template>
        </lew-table>
        <div style="margin: 20px 0px 0px 20px">
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

<style lang="scss" scoped>
    .article-wrapper {
        .header {
            padding: 30px;
            box-sizing: border-box;
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
