<script setup lang="ts">
    import { LewMenu } from 'lew-ui';
    import menu from '@/router/menu';

    const formatMenu = (menu: any) => {
        return menu.map((e: any) => {
            return {
                ...e,
                label: e?.meta?.label || '-',
                value: e.path,
                children: e.children ? formatMenu(e.children) : [],
                icon: e?.meta?.icon || '-'
            };
        });
    };
    let actived = ref('Guides');
    const router = useRouter();
    const route = useRoute();
    const change = (item: any) => {
        actived.value = item.value;
        router.push(item.value);
    };

    onMounted(() => {
        actived.value = route.path as string;
    });
</script>

<template>
    <div class="SideBar">
        <div class="header">
            <lew-flex x="start" class="logo"> Tn-Blog-Admin </lew-flex>
        </div>
        <lew-menu :actived="actived" :options="formatMenu(menu)" @change="change"> </lew-menu>
    </div>
</template>

<style lang="scss" scoped>
    .SideBar {
        position: fixed;
        z-index: 999;
        height: 100vh;
        box-sizing: border-box;

        .header {
            padding: 10px 0px 0px 15px;

            .logo {
                height: 50px;
                font-weight: 900;
                font-size: 20px;
                color: var(--lew-text-color-0);
            }
        }

        .title {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            font-weight: 600;
            color: #999;
        }
    }
</style>
