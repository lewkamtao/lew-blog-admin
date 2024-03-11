<script lang="ts" setup>
    import TableTurbo from '@/components/TableTurbo.vue';

    const columns = [
        {
            title: 'id',
            width: 80,
            field: 'id',
            x: 'center',
            fixed: 'left'
        },
        {
            title: '昵称',
            width: 250,
            field: 'nickname'
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
            label: '应用名称',
            type: 'input',
            field: 'name'
        },
        {
            label: '状态',
            type: 'select',
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
        router.push('/user/list/detail/' + item.id);
        toDetail;
    };
</script>

<template>
    <div class="table-page">
        <table-turbo
            ref="tableTurboRef"
            api-path="/user/list"
            :options="columns"
            :search-options="searchOptions"
        >
            <template #nickname="{ row }">
                <lew-flex style="width: 200px" gap="10px" x="start">
                    <lew-avatar :key="row.avatar" round style="width: 40px" :src="row.avatar" />
                    <lew-text-trim style="width: 140px" :text="row.nickname" />
                </lew-flex>
            </template>
            <template #action="{ row }">
                <lew-button type="text" @click="toDetail(row)"> Detail </lew-button>
            </template>
        </table-turbo>
    </div>
</template>
<style lang="scss">
    .table-page {
        padding: 20px;
        box-sizing: border-box;
    }
</style>
