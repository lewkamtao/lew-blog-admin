<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();

    var options = ref([
        {
            label: '发布文章',
            value: 'Post'
        },
        {
            label: '修改资料',
            value: 'Edit'
        },
        {
            label: '退出登录',
            value: 'LoginOut'
        }
    ]);

    const handle = (e: any, handle: any) => {
        switch (e.value) {
            case 'Post':
                router.push('/AddArticle');
                break;
            case 'Edit':
                router.push('/User');
                break;
            case 'LoginOut':
                localStorage.clear();
                setTimeout(() => {
                    var redirectUrl = window.location.href;
                    window.location.replace(`https://sso.kamtao.com?redirectUrl=${redirectUrl}`);
                }, 200);
                break;

            default:
                break;
        }
        handle.hide();
    };
</script>

<template>
    <div class="header">
        <div class="username">
            <lew-dropdown :options="options" @change="handle">
                <div>Admin</div>
            </lew-dropdown>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .header {
        box-shadow: 0px 0px 3px rgba($color: #000000, $alpha: 0.2);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0px 40px;
        height: 50px;
        box-sizing: border-box;

        .username {
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
        }
    }
</style>
