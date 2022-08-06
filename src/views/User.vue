<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import axios from '@/axios/http';
    import { useRouter } from 'vue-router';
    import dayjs from 'dayjs';
    const router = useRouter();

    let userForm = ref({
        about_bg: '',
        avatar: '',
        birthday: dayjs('1998-11-17').format('YYYY-MM-DD'),
        contact: '',
        content: '',
        description: '',
        email: '',
        facebook: '',
        favicon: '',
        home: '',
        link_bg: '',
        logo: '',
        company: '',
        site_keywords: '',
        name: '',
        nickname: '',
        phone: '',
        realname: '',
        record_code: '',
        remark: '',
        site_description: '',
        site_title: ''
    });

    const getUser = () => {
        axios
            .get({
                url: '/user'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    const {
                        about_bg,
                        avatar,
                        birthday,
                        contact,
                        content,
                        description,
                        email,
                        facebook,
                        favicon,
                        home,
                        link_bg,
                        logo,
                        company,
                        site_keywords,
                        name,
                        nickname,
                        phone,
                        realname,
                        record_code,
                        remark,
                        site_description,
                        site_title
                    } = res.data;

                    userForm.value = {
                        about_bg: about_bg,
                        avatar: avatar,
                        birthday: dayjs(birthday).format('YYYY-MM-DD'),
                        contact: contact,
                        content: content,
                        description: description,
                        email: email,
                        facebook: facebook,
                        favicon: favicon,
                        home: home,
                        link_bg: link_bg,
                        logo: logo,
                        company: company,
                        name: name,
                        nickname: nickname,
                        phone: phone,
                        realname: realname,
                        record_code: record_code,
                        remark: remark,
                        site_keywords: site_keywords,
                        site_description: site_description,
                        site_title: site_title
                    };
                }
            });
    };

    const save = () => {
        let data = JSON.parse(JSON.stringify(userForm.value));
        data.birthday = dayjs(data.birthday).format('YYYY-MM-DD HH:mm:ss');
        axios
            .put({
                url: '/user',
                data: data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('保存成功');
                }
            });
    };

    onMounted(() => {
        getUser();
    });
</script>
<template>
    <div class="user-wrapper">
        <lew-flex gap="0px" style="height: 100%" y="start" class="user-box">
            <lew-flex direction="column" gap="10px" x="start" y="start" class="left">
                <lew-title>个人资料</lew-title>
                <lew-avatar
                    round
                    style="width: 120px; height: 120px"
                    src="https://q1.qlogo.cn/g?b=qq&s=100&nk=1057072668"
                ></lew-avatar>
                <br />
                <lew-form-item direction="x" title="昵称" class="info-item">
                    <lew-input v-model="userForm.nickname" />
                </lew-form-item>
                <lew-form-item direction="x" title="描述" class="info-item">
                    <lew-input v-model="userForm.description" type="textarea" />
                </lew-form-item>

                <lew-form-item direction="y" title="头像地址" class="info-item">
                    <lew-input v-model="userForm.avatar" />
                </lew-form-item>
                <!-- <lew-form-item direction="y" title="生日" class="info-item">
                    <lew-date-picker v-model="userForm.birthday" style="width: 100%" auto-close />
                </lew-form-item> -->
                <lew-form-item direction="y" title="手机号" class="info-item">
                    <lew-input v-model="userForm.phone" />
                </lew-form-item>
                <lew-form-item direction="y" title="邮箱地址" class="info-item">
                    <lew-input v-model="userForm.email" />
                </lew-form-item>
                <lew-form-item direction="y" title="公司" class="info-item">
                    <lew-input v-model="userForm.company" />
                </lew-form-item>
                <lew-form-item direction="y" title="主页地址" class="info-item">
                    <lew-input v-model="userForm.home" />
                </lew-form-item>
                <lew-form-item direction="y" title="其他" class="info-item">
                    <lew-input v-model="userForm.remark" />
                </lew-form-item>
            </lew-flex>
            <lew-flex direction="column" gap="10px" x="start" y="start" class="right">
                <lew-title>站点信息</lew-title>
                <lew-form-item direction="y" title="标题" class="info-item">
                    <lew-input v-model="userForm.site_title" />
                </lew-form-item>
                <lew-form-item direction="y" title="描述" class="info-item">
                    <lew-input v-model="userForm.site_description" type="textarea" />
                </lew-form-item>
                <lew-form-item direction="y" title="关键词" class="info-item">
                    <lew-input v-model="userForm.site_keywords" />
                </lew-form-item>
                <lew-form-item direction="y" title="favicon" class="info-item">
                    <lew-input v-model="userForm.favicon" />
                </lew-form-item>
                <lew-form-item direction="y" title="Logo" class="info-item">
                    <lew-input v-model="userForm.logo" />
                </lew-form-item>
                <lew-form-item direction="y" title="备案码" class="info-item">
                    <lew-input v-model="userForm.record_code" />
                </lew-form-item>
                <lew-form-item direction="y" y="center" title="关于背景图" class="info-item">
                    <lew-input v-model="userForm.about_bg" />
                </lew-form-item>
                <lew-form-item direction="y" y="center" title="友链背景图" class="info-item">
                    <lew-input v-model="userForm.link_bg" />
                </lew-form-item>
                <lew-form-item direction="y" y="center" title="社交媒体配置" class="info-item">
                    <lew-input v-model="userForm.contact" />
                </lew-form-item>
                <lew-flex x="end">
                    <lew-button @click="save">保存信息</lew-button>
                </lew-flex>
            </lew-flex>
        </lew-flex>
    </div>
</template>
<style lang="scss">
    .user-wrapper {
        padding: 100px 30px;
        min-height: calc(100vh - 50px);
        box-sizing: border-box;
        background-color: var(--lew-bgcolor-1);
        .user-box {
            max-width: 800px !important;
            margin: 0 auto;
            border-radius: var(--lew-form-border-radius);
            background-color: var(--lew-bgcolor-0);
            overflow: hidden;
            border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
        }
        .left,
        .right {
            padding: 40px;
            box-sizing: border-box;
        }
        .left {
            width: 50% !important;
            border-right: var(--lew-form-border-width) var(--lew-form-border-color) solid;

            .nickname {
                font-size: 18px;
                font-weight: bold;
            }
            .info-item {
                .title {
                    color: var(--lew-text-color-7);
                    font-weight: 100;
                }
            }
            .description {
                color: var(--lew-text-color-7);
            }
        }
        .right {
            width: 50% !important;
        }
    }
</style>
