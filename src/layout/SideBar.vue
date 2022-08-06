<script setup lang="ts">
    import { ref, reactive, watch, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    const route = useRoute();
    const router = useRouter();

    watch(
        () => route.path,
        () => {
            data.active = route.path;
        }
    );
    const menus = [
        {
            title: '通用',
            routes: [
                {
                    path: '/',
                    title: '仪表盘'
                },
                {
                    path: '/Article',
                    title: '文章'
                },
                {
                    path: '/Series',
                    title: '系列'
                },
                {
                    path: '/Manage',
                    title: '管理'
                },
                {
                    path: '/User',
                    title: '个人资料'
                },
                {
                    path: '/Setting',
                    title: '系统设置'
                }
            ]
        },
        {
            title: '新建',
            routes: [
                {
                    path: '/AddArticle',
                    title: '写文章'
                }
            ]
        }
    ];

    var data = reactive({
        active: ''
    });

    const to = (path: any) => {
        router.push(path);
    };
    onMounted(() => {
        data.active = route.path;
    });
</script>

<template>
    <div class="SideBar">
        <div class="header">
            <lew-flex x="start" class="logo"> Lew Blog </lew-flex>
        </div>
        <div class="menu" v-for="(menu, index) in menus" :key="index">
            <div class="title"> {{ menu.title }} </div>
            <li
                v-for="(item, index) in menu.routes"
                @click="to(item.path)"
                :class="{ active: data.active == item.path }"
            >
                <div>{{ item.title }}</div>
            </li>
        </div>

        <div class="footer">
            <div class="title">COPYRIGHT</div>
            <div>@Lew Kamtao</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .SideBar {
        position: fixed;
        z-index: 999;
        height: 100vh;
        padding: 20px;
        box-sizing: border-box;
        .header {
            padding: 10px 0px 0px 20px;
            .logo {
                height: 50px;
                font-weight: 900;
                font-size: 20px;
                color: #000;
            }
        }

        .title {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            font-weight: 600;
            color: #999;
        }
        .menu {
            max-height: calc(100vh - 250px);
            box-sizing: border-box;
            overflow: hidden;
            .title {
                margin: 30px 0px 5px 20px;
                font-weight: 400;
                color: var(--lew-text-color-9);
            }
            li {
                padding: 8px 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: all 0.1s;
                color: var(--lew-text-color-7);
                border-radius: var(--lew-form-border-radius);
                div {
                    margin-left: 5px;
                }
            }
            li:hover {
                color: var(--lew-text-color-1);
                background-color: var(--lew-bgcolor-2);
            }
            .active {
                background-color: var(--lew-primary-color);
                color: var(--lew-white-color);
                font-weight: bold;
            }
            .active:hover {
                background-color: var(--lew-primary-color);
                color: var(--lew-white-text-color);
                font-weight: bold;
            }
        }

        .footer {
            position: absolute;
            bottom: 20px;
            padding: 15px;
            width: calc(100% - 40px);
            box-sizing: border-box;
            background-color: var(--lew-bgcolor-2);
            border-radius: var(--lew-form-border-radius);
        }
    }
</style>
