<script setup lang="ts">
    import SideBar from './SideBar.vue';
    import Header from './Header.vue';
</script>

<template>
    <div class="main">
        <SideBar class="SideBar" />
        <div class="content">
            <Header class="Header" />
            <router-view v-slot="{ Component }">
                <transition name="fade-transform" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .main {
        margin: 0 auto;
        display: flex;
        .SideBar {
            width: 220px;
            height: 100vh;
            background: #ffffff;
            box-shadow: 0px 0px 3px rgba($color: #000000, $alpha: 0.2);
        }

        .content {
            width: calc(100vw - 220px);
            min-height: calc(100vh - 50px);
            margin-left: 220px;
            box-shadow: 0px 0px 3px rgba($color: #000000, $alpha: 0.2);
            overflow: hidden;
            padding-top: 50px;
            box-sizing: border-box;
            background-color: var(--lew-form-bgcolor);
            .Header {
                position: fixed;
                width: calc(100vw - 220px);
                top: 0px;
                left: 220px;
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
