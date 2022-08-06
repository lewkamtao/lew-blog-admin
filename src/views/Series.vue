<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';

    let data: any = ref([]);
    let total = ref<number>(0);
    let pageNum = ref(1);
    let pageSize = ref(20);
    let addModal = ref(false);

    let seriesForm = ref({
        title: '',
        type: 101,
        description: ''
    });

    const getSeries = () => {
        axios
            .get({
                url: '/series/list'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    data.value = res.data;
                    total.value = res.total | 0;
                }
            });
    };

    onMounted(() => {
        getSeries();
    });

    const columns = [
        {
            title: 'id',
            width: '100px',
            field: 'id',
            x: 'center'
        },
        {
            title: '标题',
            width: '180px',
            field: 'title'
        },
        {
            title: '描述',
            width: 'auto',
            field: 'description',
            x: 'start'
        },
        {
            title: '管理',
            width: '140px',
            field: 'action',
            sticky: 'right',
            offsetX: '0px',
            x: 'center'
        }
    ];
    const addSeries = () => {
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
                addModal.value = false;
            });
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
</script>

<template>
    <div class="article-wrapper">
        <lew-flex gap="20px" x="start" class="header">
            <lew-button @click="addModal = true">新建系列</lew-button>
        </lew-flex>
        <lew-table :data="data" :columns="columns">
            <template #id="{ row }"> {{ row.id }} </template>
            <template #title="{ row }">
                {{ row.title }}
            </template>
            <template #description="{ row }">
                {{ row.description }}
            </template>
            <template #action="{ row }">
                <lew-flex>
                    <lew-button is-text>编辑</lew-button>
                    <lew-popok
                        title="删除确认"
                        content="删除之后无法恢复，请确认！"
                        placement="top"
                        width="200px"
                        @ok="delOk($event, row.id)"
                        @cancel="delCancel"
                    >
                        <lew-button is-text type="error">删除</lew-button>
                    </lew-popok>
                </lew-flex>
            </template>
        </lew-table>
        <div style="margin: 20px 0px 0px 20px">
            <lew-pagination
                v-model:page-num="pageNum"
                v-model:page-size="pageSize"
                :page-size-options="[
                    {
                        label: '10 / 页',
                        value: 10
                    },
                    {
                        label: '20 / 页',
                        value: 20
                    },
                    {
                        label: '30 / 页',
                        value: 30
                    }
                ]"
                :page-num="pageNum"
                :total="total"
            />
        </div>
        <lew-modal :visible="addModal" width="400px" @mask-click="addModal = false">
            <div class="modal-body">
                <lew-title :bold="700" style="margin-bottom: 20px">新建系列 </lew-title>

                <lew-form-item style="margin-bottom: 30px" title="系列名称">
                    <lew-input v-model="seriesForm.title" show-count :max-length="20" nice-count />
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
                    <lew-button type="normal" @click="addModal = false">关闭 </lew-button>
                    <lew-button @click="addSeries">确认保存</lew-button>
                </lew-flex>
            </div>
        </lew-modal>
    </div>
</template>

<style lang="scss" scoped>
    .article-wrapper {
        .header {
            padding: 30px;
        }
    }
    .info {
        line-height: 22px;
        padding: 10px 0px;
        .lew-avatar {
            flex-shrink: 0;
            width: 35px;
            height: 35px;
        }
        .right {
            flex-shrink: 0;
            width: calc(100% - 50px);
        }
        .name {
            font-weight: bold;
        }
        .mail {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            white-space: nowrap;
            color: var(--lew-text-color-9);
        }
    }
</style>
