<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';

    let comment_switch = ref();
    let site_switch = ref();

    let password_form = ref({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
    });

    const changeCommentSwitch = () => {
        axios
            .put({
                url: '/user',
                data: {
                    comment_switch: !comment_switch.value
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    if (comment_switch.value) {
                        LewMessage.success('已开启评论');
                        comment_switch.value = true;
                    } else {
                        LewMessage.error('已关闭评论');
                        comment_switch.value = false;
                    }
                }
            });
    };

    const closeOk = (e: any, id: number) => {
        axios
            .put({
                url: '/user',
                data: {
                    site_switch: !site_switch.value
                }
            })
            .then((res: any) => {
                e.hide();
                if (res.code == 200) {
                    setTimeout(() => {
                        if (site_switch.value) {
                            LewMessage.error('已关闭站点');
                            site_switch.value = false;
                        } else {
                            LewMessage.success('已开启站点');
                            site_switch.value = true;
                        }
                    }, 200);
                }
            });
    };

    const closeCancel = (e: any) => {
        e.hide();
    };

    const getUser = () => {
        axios
            .get({
                url: '/user'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    comment_switch.value = res.data.comment_switch;
                    site_switch.value = res.data.site_switch;
                }
            });
    };

    const savePassword = () => {
        const { new_password, old_password, new_password_confirm } = password_form.value;
        if (!new_password || !old_password || !new_password_confirm) {
            LewMessage.warning('请完善表单后提交');
            return;
        }

        if (new_password != new_password_confirm) {
            LewMessage.warning('新密码和确认密码不一致');
            return;
        }

        axios
            .put({
                url: '/user/password',
                data: {
                    new_password: new_password,
                    old_password: old_password
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('修改成功');
                }
            });
    };

    onMounted(() => {
        getUser();
    });
</script>
<template>
    <div class="setting-wrapper">
        <div gap="0px" class="setting-box">
            <lew-title>设置</lew-title>
            <br />

            <lew-form-item direction="y" title="是否开启评论功能" class="info-item">
                <lew-switch @change="changeCommentSwitch" v-model="comment_switch" />
            </lew-form-item>

            <lew-popok
                :title="`${site_switch ? '关闭' : '开启'}`"
                type="error"
                :content="`${
                    site_switch ? '确认关闭之后，前台将显示正在维护站点。' : '确认开启站点？'
                }`"
                placement="top"
                width="200px"
                @ok="closeOk"
                @cancel="closeCancel"
            >
                <lew-button v-show="site_switch" type="error">临时关闭站点</lew-button>
                <lew-button v-show="!site_switch" type="primary">开启站点</lew-button>
            </lew-popok>
        </div>
        <br />
        <div gap="0px" class="setting-box">
            <lew-title>账号设置</lew-title>
            <br />
            <lew-form-item direction="y" title="旧密码" class="info-item">
                <lew-input type="password" show-password v-model="password_form.old_password" />
            </lew-form-item>
            <lew-form-item direction="y" title="新密码" class="info-item">
                <lew-input type="password" show-password v-model="password_form.new_password" />
            </lew-form-item>
            <lew-form-item direction="y" title="确认密码" class="info-item">
                <lew-input
                    type="password"
                    show-password
                    v-model="password_form.new_password_confirm"
                />
            </lew-form-item>

            <lew-button @click="savePassword">确认修改</lew-button>
        </div>
    </div>
</template>
<style lang="scss">
    .setting-wrapper {
        padding: 100px 30px;
        min-height: calc(100vh - 50px);
        box-sizing: border-box;
        background-color: var(--lew-bgcolor-1);
        .setting-box {
            max-width: 300px !important;
            width: 800px;
            margin: 0 auto;
            border-radius: var(--lew-form-border-radius);
            background-color: var(--lew-bgcolor-0);
            overflow: hidden;
            border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
            padding: 40px;
        }
    }
</style>
