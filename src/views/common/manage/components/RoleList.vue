<script lang="ts" setup>
    import axios from '@/axios/http';
    import { useVModel } from '@vueuse/core';
    import RoleModal from './RoleModal.vue';

    const roleModalRef = ref();
    const route = useRoute();

    const props = defineProps({
        modelValue: {
            type: [String, Number],
            default: ''
        },
        list: {
            type: Array,
            default: () => {
                return [];
            }
        },
        title: {
            type: String,
            default: '应用列表'
        }
    });

    const emit = defineEmits(['update:modelValue', 'change']);

    const modelValue = useVModel(props, 'modelValue', emit);
    const loading = ref(false);

    const change = (item: any = {}) => {
        modelValue.value = item.id;
        emit('change', modelValue.value);
    };

    const deleteRole = (item: any) => {
        LewDialog.error({
            title: '警告',
            okText: '删除',
            content: '你是否要删除该角色，此操作会立即生效且不可恢复，请谨慎操作！',
            closeOnClickOverlay: true,
            ok: () => {
                return new Promise((resolve) => {
                    axios
                        .delete({
                            url: `/role/${item.id}`
                        })
                        .then((res: any) => {
                            if (res.code == 200) {
                                resolve(true);
                                LewMessage.success({
                                    content: '销毁成功！'
                                });
                                init();
                            } else {
                                resolve(false);
                            }
                        });
                });
            }
        });
    };
    const getRoleList: any = inject('getRoleList');

    const init = async () => {
        loading.value = true;
        await getRoleList();
        loading.value = false;
    };

    watch(
        () => props.list,
        () => {
            if (props.list.length >= 0) {
                change(props.list[0]);
            } else {
                change();
            }
        }
    );

    onMounted(() => {
        init();
    });
</script>

<template>
    <lew-flex
        v-loading="{
            visible: loading
        }"
        x="start"
        y="start"
        gap="5px"
        direction="y"
        class="menu"
    >
        <lew-flex mode="between" x="center" y="center">
            <lew-title size="14px" style="margin-bottom: 0px" :bold="600">{{ title }} </lew-title>
            <lew-button
                icon="plus"
                type="text"
                round
                @click="roleModalRef.open({ app_id: route.params.id })"
            >
                添加
            </lew-button>
        </lew-flex>
        <div class="list lew-scrollbar">
            <li
                v-for="(item, index) in (list as any)"
                :key="index"
                class="item"
                :class="{ active: item.id === modelValue }"
                @click="change(item)"
            >
                <lew-flex direction="y" x="start" gap="3">
                    <div class="name">
                        {{ item.name }}
                    </div>
                    <div class="description">
                        {{ item.description }}
                    </div>
                </lew-flex>
                <div class="edit-btn">
                    <lew-button
                        size="small"
                        icon="edit-2"
                        round
                        type="text"
                        @click.stop="roleModalRef.open({ ...item, app_id: route.params.id })"
                    />
                </div>
                <div style="margin: 0px -5px 0px 5px" class="delete-btn">
                    <lew-button
                        size="small"
                        icon="trash"
                        round
                        type="text"
                        @click.stop="deleteRole(item)"
                    />
                </div>
            </li>
        </div>
        <lew-empty v-if="list.length == 0" title="暂无角色" style="width: 100%; padding: 40px" />
    </lew-flex>
    <role-modal ref="roleModalRef" @success="init" />
</template>

<style lang="scss" scoped>
    .menu {
        width: 100%;
        background-color: var(--lew-bgcolor-1);
        padding: 15px;
        border-radius: var(--lew-border-radius);

        .list {
            display: flex;
            flex-direction: column;
            gap: 7px;
            width: 100%;
            max-height: 500px;
            overflow-y: auto;
        }
        .item {
            width: 100%;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.1s;
            color: var(--lew-text-color-5);
            border-radius: var(--lew-border-radius);
            box-sizing: border-box;

            .description {
                font-size: 12px;
                color: var(--lew-text-color-7);
            }
            .delete-btn,
            .edit-btn {
                display: none;
            }
        }

        .item:hover {
            color: var(--lew-text-color-1);
            background-color: var(--lew-bgcolor-3);
            .delete-btn,
            .edit-btn {
                display: block;
            }
        }

        .active {
            background-color: var(--lew-color-blue-light);
            color: var(--lew-text-color-0);
        }

        .active:hover {
            background-color: var(--lew-color-blue-light);
            color: var(--lew-text-color-0);
        }
    }
</style>
