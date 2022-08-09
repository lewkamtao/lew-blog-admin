<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import CommentTable from './manage/CommentTable.vue';
    import FriendTable from './manage/FriendTable.vue';
    import MessageTable from './manage/MessageTable.vue';
    import TagTable from './manage/TagTable.vue';
    import UserTable from './manage/UserTable.vue';

    type Options = {
        label: string;
        value: string;
        activeIndex: number;
    };

    const options = ref([
        { label: '评论列表', value: '1' },
        { label: '留言板', value: '2' },
        { label: '好友', value: '3' },
        { label: '用户', value: '4' },
        { label: '标签', value: '5' }
    ]);

    let tableIndex = ref('1');

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
        <div class="manager-tabs">
            <lew-tabs
                style="width: 100%"
                class=""
                v-model="tableIndex"
                type="line"
                :options="options"
            />
        </div>

        <div>
            <CommentTable v-if="tableIndex == `1`" />
            <MessageTable v-if="tableIndex == `2`" />
            <FriendTable v-if="tableIndex == `3`" />
            <UserTable v-if="tableIndex == `4`" />
            <TagTable v-if="tableIndex == `5`" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .manager-wrapper {
        .manager-tabs {
            padding: 20px;
        }
    }
</style>
