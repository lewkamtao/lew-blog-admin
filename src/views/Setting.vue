<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';
    import dayjs from 'dayjs';
    const closeOk = (e: any, id: number) => {
        e.hide();
    };

    const closeCancel = (e: any) => {
        e.hide();
    };

    onMounted(() => {});
</script>
<template>
    <div class="setting-wrapper">
        <div gap="0px" class="setting-box">
            <lew-title>设置</lew-title>
            <br />

            <lew-form-item direction="y" title="是否开启评论功能" class="info-item">
                <lew-switch />
            </lew-form-item>

            <lew-form-item direction="y" title="是否允许评论" class="info-item">
                <lew-switch />
            </lew-form-item>
            <lew-popok
                title="关闭确认"
                type="error"
                content="确认关闭之后，前台将显示正在维护站点。"
                placement="top"
                width="200px"
                @ok="closeOk"
                @cancel="closeCancel"
            >
                <lew-button type="error">临时关闭站点</lew-button>
            </lew-popok>
        </div>
        <br />
        <div gap="0px" class="setting-box">
            <lew-title>账号设置</lew-title>
            <br />
            <lew-form-item direction="y" title="旧密码" class="info-item">
                <lew-input />
            </lew-form-item>
            <lew-form-item direction="y" title="新密码" class="info-item">
                <lew-input />
            </lew-form-item>
            <lew-form-item direction="y" title="确认密码" class="info-item">
                <lew-input />
            </lew-form-item>

            <lew-button>确认修改</lew-button>
        </div>
    </div>
</template>
<style lang="scss">
    .setting-wrapper {
        padding: 100px 30px;
        min-height: calc(100vh - 50px);
        box-sizing: border-box;
        background-color: var(--lew-bgcolor-1);
        .setting-box {
            max-width: 300px !important;
            width: 800px;
            margin: 0 auto;
            border-radius: var(--lew-form-border-radius);
            background-color: var(--lew-bgcolor-0);
            overflow: hidden;
            border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
            padding: 40px;
        }
    }
</style>
