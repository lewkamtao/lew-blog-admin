export default [
    {
        name: 'Common',
        path: '/common',
        meta: {
            label: '通用'
        },
        children: [
            {
                path: '/common/article',
                name: 'CommonArticle',
                component: () => import('@/views/common/article/index.vue'),
                meta: {
                    label: '文章',
                    icon: 'file-text',
                    breadcrumb: [
                        {
                            label: '通用',
                            value: ''
                        },
                        {
                            label: '文章',
                            value: ''
                        }
                    ]
                }
            },
            {
                path: '/common/series',
                name: 'CommonSeries',
                component: () => import('@/views/common/series/index.vue'),
                meta: {
                    label: '系列',
                    icon: 'hash',
                    breadcrumb: [
                        {
                            label: '通用',
                            value: ''
                        },
                        {
                            label: '系列',
                            value: ''
                        }
                    ]
                }
            },
            {
                path: '/common/manage',
                name: 'CommonManage',
                component: () => import('@/views/common/manage/index.vue'),
                meta: {
                    label: '管理',
                    icon: 'sliders',
                    breadcrumb: [
                        {
                            label: '通用',
                            value: ''
                        },
                        {
                            label: '管理',
                            value: ''
                        }
                    ]
                }
            },
            {
                path: '/common/profile',
                name: 'CommonProfile',
                component: () => import('@/views/common/profile/index.vue'),
                meta: {
                    label: '个人',
                    icon: 'user',
                    breadcrumb: [
                        {
                            label: '通用',
                            value: ''
                        },
                        {
                            label: '个人',
                            value: ''
                        }
                    ]
                }
            },
            {
                path: '/common/setting',
                name: 'CommonSetting',
                component: () => import('@/views/common/setting/index.vue'),
                meta: {
                    label: '设置',
                    icon: 'tool',
                    breadcrumb: [
                        {
                            label: '通用',
                            value: ''
                        },
                        {
                            label: '设置',
                            value: ''
                        }
                    ]
                }
            }
        ]
    },
    {
        name: 'creation',
        path: '/creation',
        meta: {
            label: '创作'
        },
        children: [
            {
                path: '/creation/writing',
                name: 'CreationWriting',
                component: () => import('@/views/creation/writing/index.vue'),
                meta: {
                    label: '写文章',
                    icon: 'edit',
                    breadcrumb: [
                        {
                            label: '创作',
                            value: ''
                        },
                        {
                            label: '写文章',
                            value: ''
                        }
                    ]
                }
            }
        ]
    }
];
