<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios/http';
import UploadButton from '@/components/UploadButton.vue';
import SelectIcon from '@/components/SelectIcon.vue';

let seriesList: any = ref([]);
let total = ref<number>(0);
let addModal = ref(false);
let loading = ref(false);

let seriesForm = ref({
    id: '',
    title: '',
    icon: '',
    type: 101,
    description: ''
});

let statusArr = computed(() => {
    return seriesList.value.map((e: any) => e.status == 101);
});

const getSeries = () => {
    loading.value = true;
    axios
        .get({
            url: '/api/series/list'
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

const changeStatus = (status: boolean, id: number) => {
    return new Promise((resolve) => {
        axios
            .put({
                url: '/api/series/' + id,
                data: {
                    status: !status ? 101 : 201
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    resolve(true);
                    LewMessage.success(!status ? '已开启' : '已关闭');
                } else {
                    resolve(false);
                }
            })
            .finally(() => {
                loading.value = false;
            });
    });
};

onMounted(() => {
    getSeries();
});

const save = () => {
    let _data = JSON.parse(JSON.stringify(seriesForm.value));
    const id = _data.id;
    if (id) {
        axios
            .put({
                url: '/api/series/' + id,
                data: _data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('更新成功');
                    getSeries();
                    addModal.value = false;
                    initForm();
                }
            });
    } else {
        delete _data.id;
        axios
            .post({
                url: '/api/series',
                data: _data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('添加成功');
                    getSeries();
                    initForm();
                    addModal.value = false;
                }
            });
    }
};

const delOk = (id: number) => {
    return new Promise((resolve) => {
        axios
            .delete({
                url: '/api/series/' + id
            })
            .then((res: any) => {
                resolve(true);
                if (res.code == 200) {
                    LewMessage.success('删除成功');
                    getSeries();
                }
            });
    });
};

const initForm = () => {
    seriesForm.value = {
        id: '',
        icon: '',
        title: '',
        type: 101,
        description: ''
    };
};
const edit = (item: any) => {
    const { id, title, type, icon, description } = item;
    seriesForm.value = {
        id: id,
        icon: icon,
        title: title,
        type: type,
        description: description
    };
    addModal.value = true;
};
</script>

<template>
    <div v-loading="{ isShow: loading }" class="series-wrapper">
        <lew-result v-if="!total && !loading" status="info" title="暂无系列" content="" style="height: calc(100vh - 320px)">
            <template #handle>
                <lew-flex style="margin-top: 50px">
                    <lew-button type="normal">返回</lew-button>
                    <lew-button @click="initForm(), (addModal = true)">立即添加</lew-button>
                </lew-flex>
            </template>
        </lew-result>
        <div v-if="total && !loading" class="series-main">
            <lew-flex gap="20px" x="start" class="header">
                <lew-button @click="initForm(), (addModal = true)">新建系列</lew-button>
            </lew-flex>
            <lew-flex gap="10px" direction="column" x="start" class="series-box" v-show="total">
                <lew-flex x="start" class="series-item" v-for="(item, index) in seriesList" :key="index">
                    <div class="left">
                        <i class="icon-seti" :class="('icon-' + item.icon)"></i>
                    </div>
                    <lew-flex mode="between" class="right">
                        <lew-flex direction="column" x="start" y="start" gap="5px" style="height: 50px">
                            <div class="title"> {{ item.title }}</div>
                            <div class="description"> {{ item.description }}</div>
                        </lew-flex>
                        <lew-flex gap="10px" x="end" style="width: 230px">
                            <lew-switch v-model="statusArr[index]"
                                :request="() => changeStatus(statusArr[index], item.id)" v-tooltip="{
                                    content: `关闭 / 开启`,
                                    trigger: 'mouseenter'
                                }" />
                            <lew-button style="margin-left: 5px" round is-icon @click="edit(item)" v-tooltip="{
                                content: `编辑系列`,
                                trigger: 'mouseenter'
                            }">
                                <lew-icon size="16" type="edit-2" />
                            </lew-button>
                            <lew-popok title="删除确认" content="删除之后无法恢复，请确认！" placement="top" width="200px"
                                :ok="() => delOk(item.id)">
                                <lew-button round is-icon type="error" v-tooltip="{
                                    content: `删除系列`,
                                    trigger: 'mouseenter'
                                }">
                                    <lew-icon size="16" type="trash-2" />
                                </lew-button>
                            </lew-popok>
                        </lew-flex>
                    </lew-flex>
                </lew-flex>
            </lew-flex>
        </div>
        <lew-modal :visible="addModal" width="400px">
            <div class="modal-body">
                <lew-title :bold="700" style="margin-bottom: 20px">新建系列 </lew-title>
                <lew-form-item direction="column" label="选择图标">
                    <select-icon v-model="seriesForm.icon" />
                </lew-form-item>
                <br>
                <lew-form>
                    <lew-form-item label="系列名称">
                        <lew-input v-model="seriesForm.title" show-count :max-length="20" nice-count />
                    </lew-form-item>

                    <lew-form-item label="系列描述">
                        <lew-input v-model="seriesForm.description" type="textarea" show-count :max-length="100" />
                    </lew-form-item>
                    <lew-flex x="end">
                        <lew-button type="normal" @click="addModal = false"> 关闭 </lew-button>
                        <lew-button @click="save"> 确认 </lew-button>
                    </lew-flex>
                </lew-form>
            </div>
        </lew-modal>
    </div>
</template>

<style lang="scss" scoped>
.series-wrapper {
    margin: 0 auto;
    padding: 100px 30px;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;

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
            .icon-seti{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                font-size: 50px;
                border:2px solid #eee;
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

    .icon {
        width: 100px;
        height: 100px;
        object-fit: contain;
    }
}
</style>
