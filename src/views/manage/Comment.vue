<script lang="ts" setup>
    import { Chat24Regular, Delete24Regular } from '@vicons/fluent';
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    let commentList: any = ref([]);
    let total = ref<number>(0);
    let pageNum = ref(1);
    let pageSize = ref(20);
    let curCommentId = ref('');
    let commentForm = ref({
        type: 101,
        article_id: 9,
        content: '',
        reply_id: '',
        comment_id: ''
    });

    let loading = ref(false);

    const getComment = () => {
        loading.value = true;
        axios
            .get({
                url: '/comment/list?type=101'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    commentList.value = res.data;
                    total.value = res.total;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    const postComment = () => {
        const { type, article_id, content, reply_id, comment_id } = commentForm.value;
        axios
            .post({
                url: '/comment',
                data: {
                    type: type,
                    article_id: article_id,
                    content: content,
                    reply_id: reply_id,
                    comment_id: comment_id
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('回复成功');
                    commentForm.value = {
                        type: 101,
                        article_id: 9,
                        content: '',
                        reply_id: '',
                        comment_id: ''
                    };
                    curCommentId.value = '';
                    getComment();
                }
            });
    };

    const delOk = (e: any, id: number) => {
        axios
            .delete({
                url: '/comment/' + id
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('删除成功');
                    getComment();
                }
            });
        e.hide();
    };

    const delCancel = (e: any) => {
        e.hide();
    };
    onMounted(() => {
        getComment();
    });
</script>

<template>
    <div class="comment-manage">
        <lew-result
            v-if="!total && !loading"
            status="info"
            title="暂无数据"
            content=""
            style="height: calc(100vh - 420px)"
        >
        </lew-result>
        <div v-else class="comment-box">
            <div v-for="(comment, index) in commentList" :key="index">
                <lew-comment style="padding: 10px 0px 10px 0px">
                    <template #avatar>
                        <lew-avatar
                            src="https://q1.qlogo.cn/g?b=qq&s=100&nk=1057072668"
                            alt="avatar"
                            round
                        />
                    </template>
                    <template #header>
                        <lew-flex x="start">
                            <div class="nickname">{{ comment.user.nickname }}</div>
                            <lew-tag size="small" type="info">作者</lew-tag>
                            <div class="datetime">1天前</div>
                        </lew-flex>
                    </template>
                    <template #content>
                        <div class="content">
                            {{ comment.content }}
                        </div>
                    </template>
                    <template #footer>
                        <div style="margin-top: 10px">
                            <lew-button
                                @click="
                                    (curCommentId = comment.id),
                                        (commentForm.comment_id = comment.id),
                                        (commentForm.reply_id = comment.user_id)
                                "
                                size="small"
                                type="info"
                                is-text
                            >
                                <Chat24Regular style="width: 14px" />
                                <span>Reply</span>
                            </lew-button>
                            <lew-popok
                                title="删除确认"
                                content="删除之后无法恢复，请确认！"
                                placement="top"
                                width="200px"
                                @ok="delOk($event, comment.id)"
                                @cancel="delCancel"
                            >
                                <lew-button
                                    style="margin-left: 5px"
                                    size="small"
                                    type="error"
                                    is-text
                                >
                                    <Delete24Regular style="width: 14px" />
                                    <span>删除</span>
                                </lew-button>
                            </lew-popok>
                        </div>
                    </template>
                </lew-comment>
                <lew-comment v-if="comment.id == curCommentId" style="padding: 10px 0px 10px 0px">
                    <template #avatar>
                        <lew-avatar
                            src="https://q1.qlogo.cn/g?b=qq&s=100&nk=1057072668"
                            alt="avatar"
                            round
                        />
                    </template>
                    <template #header>
                        <lew-flex x="start">
                            <div class="nickname">{{ comment.user.nickname }}</div>
                            <lew-tag size="small" type="info">作者</lew-tag>
                            <div class="datetime">1天前</div>
                        </lew-flex>
                    </template>
                    <template #content>
                        <lew-input
                            v-model="commentForm.content"
                            style="width: 100%"
                            type="textarea"
                            class="content"
                        >
                        </lew-input>
                    </template>
                    <template #footer>
                        <lew-flex x="start" style="margin-top: 10px">
                            <lew-button @click="postComment" size="small">回复</lew-button>
                            <lew-button @click="curCommentId = ''" type="normal" size="small"
                                >取消</lew-button
                            >
                        </lew-flex>
                    </template>
                </lew-comment>
                <div v-for="(item, index) in comment.comment" :key="index">
                    <lew-comment style="padding: 20px 0px 10px 50px">
                        <template #avatar>
                            <lew-avatar
                                src="https://q1.qlogo.cn/g?b=qq&s=100&nk=1057072668"
                                alt="avatar"
                                round
                            />
                        </template>
                        <template #header>
                            <lew-flex x="start">
                                <div class="nickname">{{ item.user.nickname }}</div>
                                <div class="datetime">1天前</div>
                            </lew-flex>
                        </template>
                        <template #content>
                            <div class="content">
                                <lew-mark>
                                    {{ item.user.nickname }}
                                </lew-mark>
                                回复
                                <lew-mark>{{ item.reply.nickname }}</lew-mark
                                >：
                                {{ item.content }}
                            </div>
                        </template>
                        <template #footer>
                            <div style="margin-top: 10px">
                                <lew-button
                                    @click="
                                        (curCommentId = item.id),
                                            (commentForm.comment_id = comment.id),
                                            (commentForm.reply_id = item.user_id)
                                    "
                                    size="small"
                                    is-text
                                    type="info"
                                >
                                    <Chat24Regular style="width: 14px" />
                                    <span>Reply</span>
                                </lew-button>

                                <lew-popok
                                    title="删除确认"
                                    content="删除之后无法恢复，请确认！"
                                    placement="top"
                                    width="200px"
                                    @ok="delOk($event, item.id)"
                                    @cancel="delCancel"
                                >
                                    <lew-button
                                        style="margin-left: 5px"
                                        size="small"
                                        is-text
                                        type="error"
                                    >
                                        <Delete24Regular style="width: 14px" />
                                        <span>删除</span>
                                    </lew-button>
                                </lew-popok>
                            </div>
                        </template>
                    </lew-comment>
                    <lew-comment v-if="item.id == curCommentId" style="padding: 20px 0px 0px 50px">
                        <template #avatar>
                            <lew-avatar
                                src="https://q1.qlogo.cn/g?b=qq&s=100&nk=1057072668"
                                alt="avatar"
                                round
                            />
                        </template>
                        <template #header>
                            <lew-flex x="start">
                                <div class="nickname">{{ comment.user.nickname }}</div>
                                <lew-tag size="small" type="info">作者</lew-tag>
                                <div class="datetime">1天前</div>
                            </lew-flex>
                        </template>
                        <template #content>
                            <lew-input
                                v-model="commentForm.content"
                                style="width: 100%"
                                type="textarea"
                                class="content"
                            >
                            </lew-input>
                        </template>
                        <template #footer>
                            <lew-flex x="start" style="margin-top: 10px">
                                <lew-button @click="postComment" size="small">回复</lew-button>
                                <lew-button @click="curCommentId = ''" type="normal" size="small"
                                    >取消</lew-button
                                >
                            </lew-flex>
                        </template>
                    </lew-comment>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .nickname {
        font-size: 14px;
        font-weight: bold;
        color: var(--lew-text-color-4);
        white-space: nowrap;
    }
    .datetime {
        font-size: 12px;
        color: var(--lew-text-color-7);
        white-space: nowrap;
    }
    .content {
        margin-top: 10px;
    }
    .comment-box {
        background-color: #fff;
    }
</style>
