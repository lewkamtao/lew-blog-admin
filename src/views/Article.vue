<script lang="ts" setup>
    import { ref, onMounted, computed } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';
    import { Delete20Regular, NotepadEdit20Regular, Chat20Regular } from '@vicons/fluent';
    const router = useRouter();
    let articleList: any = ref([]);
    let total = ref<number>(0);

    let statusArr = computed(() => {
        return articleList.value.map((e: any) => e.status == 101);
    });

    const getArticle = () => {
        axios
            .get({
                url: '/article/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    articleList.value = res.data;
                    total.value = res.total | 0;
                }
            });
    };

    onMounted(() => {
        getArticle();
    });

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

    const changeStatus = (i: any) => {
        console.log(statusArr.value[i]);
    };
</script>

<template>
    <div class="article-wrapper" v-show="total">
        <div class="article-main">
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
                                style="width: 80px; height: 80px"
                                :src="item.cover"
                            ></lew-avatar>
                        </div>
                    </lew-flex>
                    <lew-flex gap="5px" mode="between" style="width: 100%">
                        <lew-switch
                            v-model="statusArr[index]"
                            @change="changeStatus(index)"
                            v-tooltip="{
                                content: `显示/隐藏`,
                                trigger: 'mouseenter'
                            }"
                        />

                        <div>
                            <lew-button
                                type="normal"
                                style="margin-right: 10px"
                                round
                                size="small"
                                @click="toEdit(item.id)"
                            >
                                <NotepadEdit20Regular />编辑
                            </lew-button>

                            <lew-popok
                                title="删除确认"
                                content="删除之后无法恢复，请确认！"
                                placement="top"
                                width="200px"
                                @ok="delOk($event, item.id)"
                                @cancel="delCancel"
                            >
                                <lew-button size="small" round type="error">
                                    <Delete20Regular />删除
                                </lew-button>
                            </lew-popok>
                        </div>
                    </lew-flex>
                </lew-flex>
            </div>
        </div></div
    >
</template>

<style lang="scss" scoped>
    .article-wrapper {
        margin: 0 auto;
        padding: 100px 50px;
        min-height: calc(100vh - 50px);
        box-sizing: border-box;
        .article-main {
            max-width: 1200px;
            margin: 0 auto;

            box-sizing: border-box;
        }
        .article-grid-box {
            margin-top: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 10px;
        }
        .article-item {
            height: 200px;
            background-color: var(--lew-bgcolor-0);
            border: var(--lew-form-border-color) var(--lew-form-border-width) solid;
            border-radius: var(--lew-form-border-radius);
            padding: 20px;
            box-sizing: border-box;
            .article-info {
                width: 100%;
                height: 200px;
                white-space: nowrap;

                .article-content {
                    width: calc(100% - 80px);
                    .title {
                        font-weight: bold;
                        font-size: 18px;
                    }
                    .description {
                        color: var(--lew-text-color-5);
                        font-size: 12px;
                    }
                }
                .article-cover {
                    width: 80px;
                }
            }
        }
        .article-item:hover {
            border: var(--lew-form-border-color-focus) var(--lew-form-border-width) solid;
        }
        .article-box {
            margin-top: 30px;
        }
    }
    .modal-body {
        padding: 30px;
    }
</style>
