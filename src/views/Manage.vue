<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import Comment from './manage/Comment.vue';
    import Message from './manage/Message.vue';
    import Tag from './manage/Tag.vue';
    import User from './manage/User.vue';

    type Options = {
        label: string;
        value: string;
        activeIndex: number;
    };

    const options = ref([
        { label: '评论列表', value: 'comment' },
        { label: '留言板', value: 'message' },
        { label: '用户', value: 'user' },
        { label: '标签', value: 'tag' }
    ]);

    let tableValue = ref('comment');

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
    <div class="manager-wrapper">
        <div class="manager-body">
            <div class="manager-tabs">
                <lew-tabs
                    style="width: 100%"
                    class=""
                    v-model="tableValue"
                    type="line"
                    :options="options"
                />
            </div>

            <div>
                <Comment v-if="tableValue == `comment`" />
                <Message v-if="tableValue == `message`" />
                <User v-if="tableValue == `user`" />
                <Tag v-if="tableValue == `tag`" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .manager-wrapper {
        margin: 0 auto;
        padding: 100px 30px;
        min-height: calc(100vh - 50px);
        box-sizing: border-box;

        .manager-body {
            margin: 0 auto;
            box-sizing: border-box;
            background-color: #fff;
            padding: 30px;
            max-width: 800px;
            border-radius: var(--lew-border-radius);
        }
        .manager-tabs {
            padding-bottom: 20px;
        }
    }
</style>
