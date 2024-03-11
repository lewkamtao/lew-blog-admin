<script lang="ts" setup name="desc-table">
    defineProps({
        // 来源
        dataSource: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Array,
            default: () => []
        }
    });
</script>

<template>
    <div class="desc-table">
        <div v-for="(item, index) in options as any" :key="index" class="desc-item">
            <div style="width: 100px" class="desc-label">
                <lew-text-trim :offset="[120, 10]" placement="bottom" :text="item.label" />
                <lew-icon
                    v-if="item.tips"
                    v-tooltip="{
                        content: item.tips,
                        placement: 'bottom-start',
                        trigger: 'mouseenter'
                    }"
                    size="16"
                    class="icon"
                    type="info"
                />
            </div>
            <div class="desc-value">
                <template v-if="item.slot"> <slot :name="item.slot" /> </template>
                <template v-else>{{ item.value }}</template>
                <lew-button
                    v-if="item.edit"
                    class="edit-btn"
                    type="text"
                    color="gray"
                    size="small"
                    round
                    icon="edit-2"
                    @click="item.edit(item)"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .desc-table {
        display: flex;
        flex-direction: column;
        gap: 25px;
        .desc-item {
            display: flex;
            gap: 20px;
            .desc-label {
                display: flex;
                align-items: center;
                color: #999;
                gap: 5px;
            }
            .desc-value {
                position: relative;
                .edit-btn {
                    position: absolute;
                    right: 0px;
                    top: 50%;
                    transform: translateX(calc(100% + 10px)) translateY(-50%);
                }
            }
        }
    }
</style>
