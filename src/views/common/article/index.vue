<script lang="ts" setup>
    import AppModal from './components/AppModal.vue';
    import TableTurbo from '@/components/TableTurbo.vue';
    let appModalRef = ref();

    const columns = [
        {
            title: 'id',
            width: 80,
            field: 'id',
            x: 'center',
            fixed: 'left'
        },
        {
            title: '应用名称',
            width: 200,
            field: 'name'
        },
        {
            title: 'App Code',
            width: 140,
            field: 'app_code'
        },
        {
            title: '状态',
            width: 140,
            field: 'status'
        },
        {
            title: '创建时间',
            width: 200,
            field: 'created_at'
        },
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            field: 'action',
            x: 'end'
        }
    ];

    const searchOptions = [
        {
            placeholder: '应用名称',
            type: 'input',
            clearable: true,
            field: 'name'
        },
        {
            placeholder: '状态',
            type: 'select',
            clearable: true,
            field: 'status',
            options: [
                { label: '正常', value: '1' },
                { label: '异常', value: '2' }
            ]
        }
    ];

    const router = useRouter();
    const tableTurboRef = ref();
    const toDetail = (item: any) => {
        router.push('/common/app/detail/' + item.id);
        toDetail;
    };
    const statusMap: any = {
        101: {
            label: '运行中',
            color: 'green'
        },
        201: {
            label: '已暂停',
            color: 'red'
        },
        301: {
            label: '装修中',
            color: 'gray'
        }
    };
</script>

<template>
    <div class="table-page">
        <table-turbo
            ref="tableTurboRef"
            api-path="/article/list"
            base-u-r-l="/api_blog"
            :options="columns"
            :search-options="searchOptions"
        >
            <template #search-action>
                <lew-button icon="plus" round @click="appModalRef.open()">创建应用 </lew-button>
            </template>
            <template #status="{ row }">
                <lew-flex style="margin-left: 5px" x="start">
                    <lew-badge round :color="statusMap[row.status]?.color" />
                    {{ statusMap[row.status]?.label }}
                </lew-flex>
            </template>
            <template #action="{ row }">
                <lew-button round type="text" @click="toDetail(row)"> Detail </lew-button>
            </template>
        </table-turbo>
        <AppModal ref="appModalRef" @success="tableTurboRef.init()" />
    </div>
</template>

<style lang="scss">
    .table-page {
        padding: 20px;
        box-sizing: border-box;
    }
</style>
