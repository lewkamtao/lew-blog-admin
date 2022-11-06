<script setup lang="ts">
import SideBar from './SideBar.vue';
import Header from './Header.vue';
</script>

<template>
    <div class="main">
        <SideBar class="SideBar" />
        <div class="content">
            <Header class="Header" />
            <router-view />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    margin: 0 auto;
    max-width: 1200px;
    display: flex;

    .SideBar {
        width: 220px;
        height: 100vh;
        background: #ffffff;
        box-shadow: 0px 0px 3px rgba($color: #000000, $alpha: 0.2);
    }

    .content {
        position: relative;
        margin-top: 50px;
        width: calc(1200px - 220px);
        max-height: calc(100vh - 50px);
        overflow-y: auto;
        overflow-x: hidden;
        margin-left: 220px;
        box-shadow: 0px 0px 3px rgba($color: #000000, $alpha: 0.2);
        background-color: var(--lew-form-bgcolor);

        .Header {
            position: fixed;
            width: 1200px;
            top: 0px;
            left: 50%;
            transform: translateX(-50%);
            height: 50px;
            z-index: 99;
            background: #fff;
        }

        .wrapper {
            padding: 20px;
            min-height: calc(100vh - 60px);
            box-sizing: border-box;
            box-sizing: border-box;
            background: #fcfdfd;
        }
    }
}
</style>
