<script lang="ts" setup>
    import axios from '@/axios/http';
    import SelectIcon from '@/components/SelectIcon.vue';

    let seriesList: any = ref([]);
    let total = ref<number>(0);
    let visible = ref(false);
    let loading = ref(false);

    let seriesForm = ref({
        id: '',
        title: '',
        icon: '',
        type: 101
    });

    const getSeries = () => {
        loading.value = true;
        axios
            .get({
                url: '/series/list',
                baseURL: '/api_blog'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    seriesList.value = res.data;
                    total.value = res.total | 0;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    onMounted(() => {
        getSeries();
    });

    const save = () => {
        return new Promise<any>((resolve) => {
            let _data = JSON.parse(JSON.stringify(seriesForm.value));
            const id = _data.id;
            if (id) {
                axios
                    .put({
                        url: '/series/' + id,
                        data: _data,
                        baseURL: '/api_blog'
                    })
                    .then((res: any) => {
                        if (res.code == 200) {
                            LewMessage.success('更新成功');
                            resolve(true);
                            getSeries();
                            visible.value = false;
                            initForm();
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => {
                        resolve(false);
                    });
            } else {
                delete _data.id;
                axios
                    .post({
                        url: '/series',
                        data: _data,
                        baseURL: '/api_blog'
                    })
                    .then((res: any) => {
                        if (res.code == 200) {
                            LewMessage.success('添加成功');
                            getSeries();
                            resolve(true);
                            initForm();
                            visible.value = false;
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => {
                        resolve(false);
                    });
            }
        });
    };

    const initForm = () => {
        seriesForm.value = {
            id: '',
            icon: '',
            title: '',
            type: 101
        };
    };
    const edit = (item: any) => {
        const { id, title, type, icon } = item;
        seriesForm.value = {
            id: id,
            icon: icon,
            title: title,
            type: type
        };
        visible.value = true;
    };

    const deleteSeries = (id: number) => {
        LewDialog.error({
            title: '警告',
            okText: '删除',
            content: '你是否要删除该系列，此操作会立即生效且不可恢复，请谨慎操作！',
            closeOnClickOverlay: true,
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .delete({
                            url: `/series/${id}`,
                            baseURL: '/api_blog'
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                resolve(true);
                                LewMessage.success({
                                    content: '删除成功！'
                                });
                                getSeries();
                            } else {
                                resolve(false);
                            }
                        });
                });
            }
        });
    };
</script>

<template>
    <div v-loading="{ isShow: loading }" class="series-wrapper">
        <lew-result
            v-if="!total && !loading"
            status="info"
            title="暂无系列"
            content=""
            style="height: calc(100vh - 320px)"
        >
            <template #handle>
                <lew-flex style="margin-top: 50px">
                    <lew-button type="light" color="gray">返回</lew-button>
                    <lew-button type="light" color="blue" @click="initForm(), (visible = true)">
                        立即添加
                    </lew-button>
                </lew-flex>
            </template>
        </lew-result>
        <div v-if="total && !loading" class="series-main">
            <lew-flex gap="20px" x="start" class="header">
                <lew-button @click="initForm(), (visible = true)">新建系列</lew-button>
            </lew-flex>
            <lew-flex v-show="total" gap="10px" direction="y" x="start" class="series-box">
                <lew-flex
                    v-for="(item, index) in seriesList"
                    :key="index"
                    x="start"
                    class="series-item"
                >
                    <div class="left">
                        <i class="icon-seti" :class="'icon-' + item.icon"></i>
                    </div>
                    <lew-flex mode="between" class="right">
                        <lew-flex direction="y" x="start" y="center" gap="5px" style="height: 50px">
                            <div class="title"> {{ item.title }}</div>
                            <div class="description"> 共 {{ item.article.length }} 篇文章</div>
                        </lew-flex>
                        <lew-flex gap="10px" x="end" style="width: 230px">
                            <lew-button
                                v-tooltip="{
                                    content: `编辑系列`,
                                    trigger: 'mouseenter'
                                }"
                                type="light"
                                color="blue"
                                round
                                icon="edit"
                                @click="edit(item)"
                            />

                            <lew-button
                                v-tooltip="{
                                    content: `删除系列`,
                                    trigger: 'mouseenter'
                                }"
                                type="light"
                                color="red"
                                round
                                icon="trash-2"
                                @click="deleteSeries(item.id)"
                            />
                        </lew-flex>
                    </lew-flex>
                </lew-flex>
            </lew-flex>
        </div>
        <lew-modal
            v-model:visible="visible"
            title="新建系列"
            width="400px"
            :ok-props="{ request: save }"
            @cancel="visible = false"
        >
            <lew-flex direction="y" gap="20" class="modal-body">
                <lew-flex y="center" class="form-item">
                    <div class="label">系列名称</div>
                    <lew-input v-model="seriesForm.title" show-count :max-length="20" nice-count />
                </lew-flex>
                <lew-flex class="form-item" direction="y" x="start">
                    <div class="label">选择图标</div>
                    <select-icon v-model="seriesForm.icon" />
                </lew-flex>
            </lew-flex>
        </lew-modal>
    </div>
</template>

<style lang="scss" scoped>
    .series-wrapper {
        margin: 0 auto;
        padding: 100px 30px;
        min-height: calc(100vh - 50px);
        box-sizing: border-box;
        background-color: var(--lew-bgcolor-2);

        .series-main {
            max-width: 600px;
            margin: 0 auto;
        }

        .series-item {
            width: 100%;
            background-color: var(--lew-bgcolor-0);
            border-radius: var(--lew-border-radius);
            padding: 15px;
            box-sizing: border-box;

            .left {
                .icon-seti {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50px;
                    height: 50px;
                    font-size: 50px;
                    border: 2px solid #eee;
                    box-sizing: border-box;
                    border-radius: var(--lew-border-radius);
                    overflow: hidden;
                }
            }

            .right {
                white-space: nowrap;

                .title {
                    font-weight: bold;
                }

                .description {
                    font-size: 12px;
                    color: var(--lew-text-color-5);
                }
            }
        }

        .series-box {
            margin-top: 30px;
        }
    }

    .modal-body {
        padding: 30px;
        .form-item {
            white-space: nowrap;
        }
        .icon {
            width: 100px;
            height: 100px;
            object-fit: contain;
        }
    }
</style>
