<script lang="ts" setup>
    import UploadButton from '@/components/UploadButton.vue';

    const tabsValue = ref(1);
</script>

<template>
    <div class="profile">
        <div class="profile-wrapper">
            <lew-flex direction="y" x="start" class="header">
                <lew-avatar width="100" height="100" round></lew-avatar>
                <UploadButton />
            </lew-flex>
            <div class="profile-main">
                <lew-tabs
                    v-model="tabsValue"
                    style="width: 100%"
                    type="line"
                    :options="[
                        {
                            label: '个人信息',
                            value: 1
                        },
                        {
                            label: '站点信息',
                            value: 2
                        }
                    ]"
                >
                </lew-tabs>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .profile {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        background-color: var(--lew-bgcolor-1);
        box-sizing: border-box;
        .profile-wrapper {
            width: 600px;
            height: auto;
            background-color: var(--lew-bgcolor-0);
            box-shadow: 0px 0px 2px rgba($color: #000000, $alpha: 0.25);
            padding: 20px;
            margin-top: 50px;
            .header {
                width: 100%;
                margin-bottom: 30px;
            }
        }
    }
</style>
