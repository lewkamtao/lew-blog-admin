<script setup lang="ts">
    import { ref } from 'vue';
    import { useDark } from '@vueuse/core';
    import axios from '@/axios/http';

    const isDark = useDark({
        selector: 'body',
        valueDark: 'lew-dark',
        valueLight: 'lew-light'
    });
    const route = useRoute();

    var options = ref([
        {
            label: '退出登录',
            value: 'LoginOut'
        }
    ]);

    const menuList = ref([]);

    axios
        .get({
            url: '/dic/list',
            params: {
                page: 1,
                limit: -1,
                pids: 399
            }
        })
        .then((res: any) => {
            if (res.code == 200) {
                menuList.value = res.data.map((e: any) => {
                    return {
                        label: e.name,
                        value: e.remark
                    };
                });
            }
        });

    const handle = (e: any, handle: any) => {
        switch (e.value) {
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

    const breadcrumb = computed(() => {
        const _breadcrumb: any = route.meta.breadcrumb || [];
        if (_breadcrumb.length > 0) {
            _breadcrumb[_breadcrumb.length - 1].active = true;
        }
        return route.meta.breadcrumb;
    });

    const change = (e: any) => {
        location.href = e.value;
    };

    const backHome = () => {
        location.href = 'https://app.tngeek.com/#/';
    };
</script>

<template>
    <div class="header">
        <lew-flex gap="20px" x="beween">
            <lew-breadcrumb class="breadcrumb" :options="breadcrumb" icon-type="shoulder" />
            <lew-flex x="end" gap="35px">
                <lew-icon
                    v-show="isDark"
                    class="menu-item icon-mode-sunny"
                    type="sun"
                    size="18"
                    @click="isDark = false"
                />
                <lew-icon
                    v-show="!isDark"
                    class="menu-item icon-mode-moon"
                    type="moon"
                    size="18"
                    @click="isDark = true"
                />
                <lew-icon class="menu-item" type="home" size="18" @click="backHome" />
                <lew-dropdown :options="menuList" @change="change">
                    <lew-icon class="menu-item" type="grid" size="18" />
                </lew-dropdown>
                <lew-dropdown :options="options" @change="handle">
                    <lew-icon class="menu-item" size="18" type="user"></lew-icon>
                </lew-dropdown>
            </lew-flex>
        </lew-flex>
    </div>
</template>

<style lang="scss" scoped>
    .header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0px 40px 0px 16px;
        height: 50px;
        box-sizing: border-box;
        user-select: none;
        .breadcrumb {
            width: calc(100% - 100px);
            flex-direction: 0;
        }
        .menu-item {
            cursor: pointer;
        }
        .menu-item:hover {
            opacity: 0.8;
        }
    }
</style>
