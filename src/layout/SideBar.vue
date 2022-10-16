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
                // {
                //     path: '/',
                //     icon: ArrowTrending24Regular,
                //     title: '仪表盘'
                // },
                {
                    path: '/Article',
                    icon: 'file-text',
                    title: '文章'
                },
                {
                    path: '/Series',
                    icon: 'hash',
                    title: '系列'
                },
                {
                    path: '/Manage',
                    icon: 'sliders',
                    title: '管理'
                },
                {
                    path: '/User',
                    icon: 'user',
                    title: '个人资料'
                },
                {
                    path: '/Setting',
                    icon: 'tool',
                    title: '系统设置'
                }
            ]
        },
        {
            title: '新建',
            routes: [
                {
                    path: '/AddArticle',
                    title: '写文章',
                    icon: 'edit-2'
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
        <div class="menu" v-for="(menu, mIndex) in menus" :key="mIndex">
            <div class="title"> {{ menu.title }} </div>
            <li
                v-for="(item, index) in menu.routes"
                @click="to(item.path)"
                :key="index"
                :class="{ active: data.active == item.path }"
            >
                <lew-icon :type="item.icon" size="18"></lew-icon>
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
            padding: 10px 0px 0px 15px;
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
                margin: 20px 0px 5px 15px;
                font-weight: 400;
                color: var(--lew-text-color-9);
            }
            li {
                padding: 10px 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: all 0.1s;
                color: var(--lew-text-color-5);
                border-radius: var(--lew-form-border-radius);
                div {
                    margin-left: 10px;
                }
            }
            li:hover {
                color: var(--lew-text-color-1);
                background-color: var(--lew-bgcolor-2);
            }
            .active {
                background-color: var(--lew-primary-color);
                color: var(--lew-white-color);
            }
            .active:hover {
                background-color: var(--lew-primary-color);
                color: var(--lew-white-text-color);
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
