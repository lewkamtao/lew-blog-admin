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
    <div class="comment-table">
        <lew-table :data="data" :columns="columns">
            <template #id="{ row }"> {{ row.id }} </template>

            <template #title="{ row }">
                {{ row.title }}
            </template>
            <template #content="{ row }">
                {{ row.content }}
            </template>
        </lew-table>
        <div style="margin: 20px 0px 40px 20px" v-show="total">
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

<style lang="scss" scoped></style>
