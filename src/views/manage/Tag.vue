<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios/http';
import { useRouter } from 'vue-router';

const router = useRouter();
let data: any = ref([]);
let total = ref<number>(0);
let pageNum = ref(1);
let pageSize = ref(10);
let loading = ref(false);

const getTag = () => {
    loading.value = true;
    axios
        .get({
            url: `/api/tag/list?page=${pageNum.value}&limit=${pageSize.value}`
        })
        .then((res: any) => {
            if (res.code == 200) {
                data.value = res.data;
                total.value = res.total;
            }
        })
        .finally(() => {
            loading.value = false;
        });
};

onMounted(() => {
    getTag();
});

const columns = [
    {
        title: '标签名',
        width: '180px',
        field: 'title'
    },
    {
        title: '文章',
        width: 'auto',
        field: 'article',
        x: 'start'
    },
    {
        title: '操作',
        width: '80px',
        field: 'action',
        x: 'center',
    }
];
const delOk = (e: any, id: number) => {
    axios
        .delete({
            url: '/api/tag/' + id
        })
        .then((res: any) => {
            if (res.code == 200) {
                LewMessage.success('删除成功');
                getTag();
            }
        });
    e.hide();
};

let timer: any;
const changeFn = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        getTag()
    }, 100);
}

const delCancel = (e: any) => {
    e.hide();
};  
</script>

<template>
    <div class="tag-table">
        <lew-result v-if="!total" status="info" title="暂无数据" content="" style="height: calc(100vh - 240px)">
        </lew-result>
        <lew-table v-else :data="data" :columns="columns">
            <template #title="{ row }">
                {{ row.title }}
            </template>
            <template #article="{ row }">
                <lew-flex x="start" direction="column">
                    <lew-tag size="small" type="info" v-for="(item, index) in row.article" :key="index">{{ item.title }}
                    </lew-tag>
                </lew-flex>
            </template>
            <template #action="{ row }">
                <lew-popok title="删除确认" content="删除之后无法恢复，请确认！" placement="top" width="200px"
                    @ok="delOk($event, row.title)" @cancel="delCancel">
                    <lew-button is-text type="error">删除</lew-button>
                </lew-popok>
            </template>
        </lew-table>
        <div style="margin: 20px 0px" v-show="total">
            <lew-pagination v-model:page-num="pageNum" v-model:page-size="pageSize" :page-size-options="[
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
            ]" @change="changeFn" :total="total" />
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
