<script setup lang="ts">
    import SideBar from './SideBar.vue';
    import Header from './Header.vue';
    import { useState } from '@/store/state';
    const cur = useState();
</script>

<template>
    <div class="lew-main">
        <SideBar class="SideBar" />
        <div id="lew-content" v-loading="{ visible: cur.loading }" class="content">
            <Header class="header" />
            <div class="wrapper lew-scrollbar">
                <router-view v-slot="{ Component }">
                    <transition name="fade-transform" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .lew-main {
        margin: 0 auto;
        display: flex;
        max-width: 1500px;
        height: 100vh;
        overflow: hidden;
        border-left: var(--lew-form-border-color) 1px solid;
        border-right: var(--lew-form-border-color) 1px solid;
        box-sizing: border-box;

        .SideBar {
            width: 220px;
            height: 100vh;
            background: var(--lew-bgcolor-0);
            box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.05);
        }

        .content {
            max-width: 1500px;
            width: calc(100% - 220px);
            margin-left: 220px;
            min-height: calc(100vh - 50px);
            background-color: var(--lew-bgcolor-0);
            .header {
                position: relative;
                height: 50px;
                background: var(--lew-bgcolor-0);
                z-index: 99;
                box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.05);
            }

            .wrapper {
                position: relative;
                width: 100%;
                height: calc(100vh - 50px);
                box-sizing: border-box;
                overflow-y: scroll;
                overflow-x: hidden;
            }
        }
    }
</style>
