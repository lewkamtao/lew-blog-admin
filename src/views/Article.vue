<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios/http';
import { useRouter } from 'vue-router';
import { dateFormat } from '@/utils';
import { ArticleList, } from '@/views/article';

const router = useRouter();
const pageNum: any = ref(1);
const pageSize: any = ref(10);
const total = ref<number>(0);
const loading = ref(false);

const options = ref([
    { label: '全部', value: 'all' },
    { label: '已发布', value: 'publish' },
    { label: '草稿箱', value: 'draft' },
]);

let tabValue = ref("all")
</script>

<template>
    <div v-loading="{ isShow: loading }" class="article-wrapper">
        <lew-flex class="header" mode="between" y="end">
            <lew-flex direction="y" x="start" gap="0px">
                <lew-title>
                    Article
                </lew-title>
                <div class="sub-title">文章列表</div>
            </lew-flex>
            <lew-button @click="router.push('/AddArticle')">新建文章</lew-button>
        </lew-flex>
        <div class="article-main">
            <div style="margin-bottom:20px">
                <lew-tabs v-model="tabValue" style="width: 100%" type="line" :options="options" />
            </div>
            <article-list :mode="tabValue" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.article-wrapper {
    margin: 0 auto;
    padding: 30px;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
    background-color: #eee;

    .header {
        margin-bottom: 30px;


    }



    .article-main {
        background-color: #fff;
        padding: 20px;
        border-radius: var(--lew-border-radius);
    }
}

.modal-body {
    padding: 30px;
}
</style>
