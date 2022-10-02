<script lang="ts" setup>
    import { ref, onMounted, computed } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';
    import { dateFormat } from '@/utils';
    import { Delete20Regular, NotepadEdit20Regular } from '@vicons/fluent';

    const router = useRouter();
    let articleList: any = ref([]);
    let total = ref<number>(0);
    let loading = ref(false);

    let statusArr = computed(() => {
        return articleList.value.map((e: any) => e.status == 101);
    });

    const changeStatus = (status: boolean, id: number) => {
        axios
            .put({
                url: '/article/' + id,
                data: {
                    status: status ? 101 : 201
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success(status ? '已开启' : '已关闭');
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const getArticle = () => {
        loading.value = true;
        axios
            .get({
                url: '/article/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    articleList.value = res.data;
                    total.value = res.total | 0;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const delOk = (id: number) => {
        return new Promise((resolve, reject) => {
            axios
                .delete({
                    url: '/article/' + id
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        LewMessage.success('删除成功');
                        getArticle();
                    }
                    resolve(true);
                });
        });
    };
    onMounted(() => {
        getArticle();
    });
</script>

<template>
    <div class="article-wrapper">
        <lew-result
            v-if="!total && !loading"
            status="info"
            title="暂无文章"
            content=""
            style="height: calc(100vh - 320px)"
        >
            <template #handle>
                <lew-flex style="margin-top: 50px">
                    <lew-button type="normal">返回</lew-button>
                    <lew-button @click="router.push('/AddArticle')">前往发布</lew-button>
                </lew-flex>
            </template>
        </lew-result>
        <div v-else class="article-main">
            <lew-flex gap="20px" x="start" class="header">
                <lew-button @click="router.push('/AddArticle')">新建文章</lew-button>
            </lew-flex>
            <div class="article-grid-box">
                <lew-flex
                    x="start"
                    direction="column"
                    class="article-item"
                    v-for="(item, index) in articleList"
                    :key="index"
                >
                    <lew-flex mode="between" y="start" class="article-info">
                        <lew-flex direction="column" x="start" y="start" class="article-content">
                            <lew-flex x="start" class="title"> {{ item.title }}</lew-flex>

                            <lew-flex wrap x="start">
                                <lew-tag round size="small" type="primary">
                                    {{ item.series.title }}
                                </lew-tag>
                                <lew-tag
                                    round
                                    size="small"
                                    v-for="(tag, ti) in item.tags"
                                    :key="`tag${ti}`"
                                    >{{ tag.title }}</lew-tag
                                >
                            </lew-flex>
                            <div class="description"> {{ item.description }}</div>
                        </lew-flex>
                        <div class="article-cover">
                            <lew-avatar
                                style="width: 120px; height: 120px"
                                :src="item.cover"
                            ></lew-avatar>
                        </div>
                    </lew-flex>
                    <lew-flex class="article-footer" gap="5px" style="width: 100%">
                        <lew-flex class="left" x="start" gap="15px">
                            <span>
                                浏览
                                {{ item.view_num }}
                            </span>

                            <span>
                                评论
                                {{ item.comment_num }}
                            </span>
                            <span>{{ dateFormat(item.created_at) }}</span>
                        </lew-flex>
                        <lew-flex x="end" gap="10px" class="right">
                            <lew-button
                                type="normal"
                                round
                                is-icon
                                @click="router.push('/AddArticle?id=' + item.id)"
                                v-tooltip="{
                                    content: `编辑文章`,
                                    trigger: 'mouseenter'
                                }"
                            >
                                <NotepadEdit20Regular />
                            </lew-button>

                            <lew-popok
                                title="删除确认"
                                content="删除之后无法恢复，请确认！"
                                placement="top"
                                width="200px"
                                :ok="() => delOk(item.id)"
                            >
                                <lew-button
                                    is-icon
                                    round
                                    type="error"
                                    v-tooltip="{
                                        content: `删除文章`,
                                        trigger: 'mouseenter'
                                    }"
                                >
                                    <Delete20Regular />
                                </lew-button>
                            </lew-popok>
                            <lew-switch
                                v-model="statusArr[index]"
                                @change="changeStatus(statusArr[index], item.id)"
                                v-tooltip="{
                                    content: `关闭 / 开启`,
                                    trigger: 'mouseenter'
                                }"
                            />
                        </lew-flex>
                    </lew-flex>
                </lew-flex>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .article-wrapper {
        margin: 0 auto;
        padding: 100px 30px;
        min-height: calc(100vh - 50px);
        max-width: 1000px;
        box-sizing: border-box;
        .article-main {
            box-sizing: border-box;
        }
        .article-grid-box {
            margin-top: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 10px;
        }
        .article-item {
            height: 250px;
            background-color: var(--lew-bgcolor-0);
            border: var(--lew-form-border-color) var(--lew-form-border-width) solid;
            border-radius: var(--lew-form-border-radius);
            padding: 30px;
            box-sizing: border-box;
            .article-info {
                width: 100%;
                height: 200px;

                .article-content {
                    width: calc(100% - 150px);
                    .title {
                        font-size: 16px;
                    }
                    .description {
                        color: var(--lew-text-color-5);
                        font-size: 12px;
                    }
                }
                .article-cover {
                    width: 120px;
                }
            }
            .article-footer {
                .left {
                    white-space: nowrap;
                    font-size: 12px;
                    color: var(--lew-text-color-7);
                }
            }
        }
        .article-box {
            margin-top: 30px;
        }
    }
    .modal-body {
        padding: 30px;
    }
</style>
