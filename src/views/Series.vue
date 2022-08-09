<script lang="ts" setup>
    import { ref, onMounted, computed } from 'vue';
    import axios from '@/axios/http';

    import { Delete20Regular, NotepadEdit20Regular } from '@vicons/fluent';

    let seriesList: any = ref([]);
    let total = ref<number>(0);
    let addModal = ref(false);

    let seriesForm = ref({
        id: '',
        title: '',
        cover: '',
        type: 101,
        description: ''
    });

    let statusArr = computed(() => {
        return seriesList.value.map((e: any) => e.status == 101);
    });

    const getSeries = () => {
        axios
            .get({
                url: '/series/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    seriesList.value = res.data;
                    total.value = res.total | 0;
                }
            });
    };

    onMounted(() => {
        getSeries();
    });

    const save = () => {
        const id = seriesForm.value.id;
        if (id) {
            axios
                .put({
                    url: '/series/' + id,
                    data: seriesForm.value
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        LewMessage.success('保存成功');
                        getSeries();
                    }
                    initForm();
                    addModal.value = false;
                });
        } else {
            axios
                .post({
                    url: '/series',
                    data: seriesForm.value
                })
                .then((res: any) => {
                    if (res.code == 200) {
                        LewMessage.success('保存成功');
                        getSeries();
                    }
                    initForm();
                    addModal.value = false;
                });
        }
    };
    const delOk = (e: any, id: number) => {
        axios
            .delete({
                url: '/series/' + id
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('删除成功');
                    getSeries();
                }
            });
        e.hide();
    };

    const delCancel = (e: any) => {
        e.hide();
    };
    const initForm = () => {
        seriesForm.value = {
            id: '',
            cover: '',
            title: '',
            type: 101,
            description: ''
        };
    };
    const edit = (item: any) => {
        const { id, title, type, cover, description } = item;
        seriesForm.value = {
            id: id,
            cover: cover,
            title: title,
            type: type,
            description: description
        };
        addModal.value = true;
    };
</script>

<template>
    <div class="series-wrapper" v-show="total">
        <div class="series-main">
            <lew-flex gap="20px" x="start" class="header">
                <lew-button @click="initForm(), (addModal = true)">新建系列</lew-button>
            </lew-flex>
            <lew-flex gap="10px" direction="column" x="start" class="series-box">
                <lew-flex
                    x="start"
                    class="series-item"
                    v-for="(item, index) in seriesList"
                    :key="index"
                >
                    <div class="left">
                        <lew-avatar style="width: 50px; height: 50px" :src="item.cover" />
                    </div>
                    <lew-flex mode="between" class="right">
                        <lew-flex
                            direction="column"
                            x="start"
                            y="start"
                            gap="5px"
                            style="height: 50px"
                        >
                            <div class="title"> {{ item.title }}</div>
                            <div class="description"> {{ item.description }}</div>
                        </lew-flex>
                        <lew-flex gap="5px" x="end" style="width: 230px">
                            <lew-switch
                                v-model="statusArr[index]"
                                v-tooltip="{
                                    content: `显示/隐藏`,
                                    trigger: 'mouseenter'
                                }"
                            />
                            <lew-button
                                style="margin-left: 5px"
                                round
                                is-icon
                                size="large"
                                @click="edit(item)"
                            >
                                <NotepadEdit20Regular />
                            </lew-button>
                            <lew-popok
                                title="删除确认"
                                content="删除之后无法恢复，请确认！"
                                placement="top"
                                width="200px"
                                @ok="delOk($event, item.id)"
                                @cancel="delCancel"
                            >
                                <lew-button round is-icon type="error" size="large">
                                    <Delete20Regular />
                                </lew-button>
                            </lew-popok>
                        </lew-flex>
                    </lew-flex>
                </lew-flex>
            </lew-flex>
            <lew-modal :visible="addModal" width="400px" @mask-click="addModal = false">
                <div class="modal-body">
                    <lew-title :bold="700" style="margin-bottom: 20px">新建系列 </lew-title>

                    <lew-form-item style="margin-bottom: 30px" title="系列名称">
                        <lew-input
                            v-model="seriesForm.title"
                            show-count
                            :max-length="20"
                            nice-count
                        />
                    </lew-form-item>
                    <lew-form-item style="margin-bottom: 30px" title="头图链接">
                        <lew-input v-model="seriesForm.cover" />
                    </lew-form-item>
                    <lew-form-item style="margin-bottom: 30px" title="系列描述">
                        <lew-input
                            v-model="seriesForm.description"
                            type="textarea"
                            show-count
                            :max-length="100"
                        />
                    </lew-form-item>
                    <lew-flex x="end">
                        <lew-button type="normal" @click="addModal = false"> 关闭 </lew-button>
                        <lew-button @click="save"> 确认保存 </lew-button>
                    </lew-flex>
                </div>
            </lew-modal>
        </div></div
    >
</template>

<style lang="scss" scoped>
    .series-wrapper {
        margin: 0 auto;
        padding: 100px 50px;
        background-color: var(--lew-form-bgcolor);
        min-height: calc(100vh - 50px);
        box-sizing: border-box;

        .series-main {
            max-width: 800px;
            margin: 0 auto;
        }
        .series-item {
            width: 100%;
            background-color: var(--lew-bgcolor-0);
            border: var(--lew-form-border-color) var(--lew-form-border-width) solid;
            border-radius: var(--lew-form-border-radius);
            padding: 15px;
            box-sizing: border-box;
            .left {
                font-size: 0px;
            }
            .right {
                white-space: nowrap;
                .title {
                    font-weight: bold;
                }
                .description {
                    color: var(--lew-text-color-5);
                }
            }
        }
        .series-item:hover {
            border: var(--lew-form-border-color-focus) var(--lew-form-border-width) solid;
        }
        .series-box {
            margin-top: 30px;
        }
    }

    .modal-body {
        padding: 30px;
    }
</style>
