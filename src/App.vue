<script lang="ts" setup></script>

<template>
    <div class="wrapper">
        <RouterView />
    </div>
</template>

<style scoped lang="scss">
    @media (max-width: 767px) {
        .wrapper::before {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            content: '';
            z-index: 9999;
            background-color: var(--lew-bgcolor-0);
        }
        .wrapper::after {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            white-space: nowrap;
            content: '不支持手机使用，请用电脑打开。';
        }
    }
</style>
