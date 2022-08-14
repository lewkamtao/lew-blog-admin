<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    let userList: any = ref([]);
    let total = ref<number>(0);
    let pageNum = ref(1);
    let pageSize = ref(20);

    const getUser = () => {
        axios
            .get({
                url: '/user/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    userList.value = res.data;
                    total.value = res.total;
                }
            });
    };

    onMounted(() => {
        getUser();
    });
</script>

<template>
    <div class="user-manage">
        <lew-flex x="start" class="user-box" v-for="(item, index) in userList" :key="index">
            <lew-avatar :src="item.avatar" round />
            <div class="info">
                <lew-flex x="start" class="header">
                    <div class="nickname"> {{ item.nickname || '未命名' }} </div>
                    <lew-tag v-if="item.type == 301" size="small" type="info">好友</lew-tag>
                    <lew-tag v-if="item.type == 201" size="small" type="error">管理员</lew-tag>
                </lew-flex>

                <div class="description"> {{ item.description }} </div>
            </div>
        </lew-flex>
    </div>
</template>

<style lang="scss" scoped>
    .user-manage {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 10px;
        .user-box {
            background-color: var(--lew-bgcolor-2);
            height: 60px;
            border-radius: var(--lew-form-border-radius);
            padding: 10px;
            border: var(--lew-form-border-color) var(--lew-form-border-width) solid;
            box-sizing: border-box;
            .info {
                width: calc(100% - 60px);
                .header {
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .description {
                    font-size: 12px;
                    color: var(--lew-text-color-5);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    min-height: 18px;
                }
            }
        }
        .user-box:hover {
            border: var(--lew-form-border-color-focus) var(--lew-form-border-width) solid;
        }
    }
</style>
