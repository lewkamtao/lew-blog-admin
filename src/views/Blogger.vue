<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios/http';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import UploadButton from '@/components/UploadButton.vue';

const router = useRouter();

let loading = ref(false);


const options = ref([
    { label: '个人资料', value: '1' },
    { label: '站点信息', value: '2' },
]);

let tabValue = ref("1")

let userForm = ref({
    avatar: '',
    birthday: dayjs('1998-11-17').format('YYYY-MM-DD'),
    contact: '',
    description: '',
    email: '',
    favicon: '',
    home: '',
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
    loading.value = true;
    axios
        .get({
            url: '/api/blogger'
        })
        .then((res: any) => {
            if (res.code == 200) {
                const {
                    avatar,
                    birthday,
                    contact,
                    description,
                    email,
                    favicon,
                    home,
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
                    avatar: avatar,
                    birthday: dayjs(birthday).format('YYYY-MM-DD'),
                    contact: contact,
                    description: description,
                    email: email,
                    favicon: favicon,
                    home: home,
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
            } else if (res.code == 555) {
                LewMessage.error('请先创建博客信息');
            }
        })
        .finally(() => {
            loading.value = false;
        });
};

const save = () => {
    let data = JSON.parse(JSON.stringify(userForm.value));
    data.birthday = dayjs(data.birthday).format('YYYY-MM-DD HH:mm:ss');
    axios
        .put({
            url: '/api/blogger',
            data: data
        })
        .then((res: any) => {
            if (res.code == 200) {
                LewMessage.success('保存成功');
                location.reload();
            }
        });
};

onMounted(() => {
    getUser();
});
</script>
<template>
    <div v-loading="{ isShow: loading }" class="user-wrapper">
        <lew-flex v-show="!loading" gap="0px" direction="column" y="start" x="start" class="user-box">
            <lew-flex direction="column" class="header">
                <lew-avatar round style="width: 120px; height: 120px" :src="userForm.avatar"></lew-avatar>
                <upload-button text="上传头像" @upload-success="(url) => (userForm.avatar = url)" />
            </lew-flex>
            <lew-tabs v-model="tabValue" type="line" style="width: 100%" :options="options" />
            <lew-form v-if="tabValue == '1'" direction="x" label-width="70px" label-align="left" class="form-box">
                <lew-form-item label="昵称">
                    <lew-input placeholder="输入昵称" v-model="userForm.nickname" />
                </lew-form-item>
                <lew-form-item label="描述">
                    <lew-input placeholder="输入博主描述" v-model="userForm.description" type="textarea" />
                </lew-form-item>
                <lew-form-item label="生日">
                    <lew-date-picker v-model="userForm.birthday" style="width: 100%" auto-close />
                </lew-form-item>
                <lew-form-item label="手机号">
                    <lew-input placeholder="输入手机号" v-model="userForm.phone" :max-length="11" />
                </lew-form-item>
                <lew-form-item label="邮箱地址">
                    <lew-input placeholder="输入邮箱地址" v-model="userForm.email" />
                </lew-form-item>
                <lew-form-item label="公司">
                    <lew-input placeholder="输入公司" v-model="userForm.company" />
                </lew-form-item>
                <lew-form-item label="主页地址">
                    <lew-input placeholder="输入主页地址" v-model="userForm.home" />
                </lew-form-item>
                <lew-flex x="end">
                    <lew-button @click="save">保存信息</lew-button>
                </lew-flex>
            </lew-form>
            <lew-form v-if="tabValue == '2'" direction="x" label-width="70px" label-align="left" class="form-box">
                <lew-form-item label="Logo">
                    <lew-flex direction="column" x="start">
                        <img style="width: 40px; height: 40px" class="head_img" v-show="userForm.logo" :src="userForm.logo"
                            alt="" srcset="" />
                        <upload-button text="上传 Logo" @upload-success="(url) => (userForm.logo = url)" />
                    </lew-flex>
                </lew-form-item>
                <lew-form-item label="favicon">
                    <lew-flex direction="column" x="start">
                        <img style="width: 20px; height: 20px" class="head_img" v-show="userForm.favicon"
                            :src="userForm.favicon" alt="" srcset="" />
                        <upload-button text="上传 favicon" @upload-success="(url) => (userForm.favicon = url)" />
                    </lew-flex>
                </lew-form-item>

                <lew-form-item label="站点标题">
                    <lew-input placeholder="输入站点标题" v-model="userForm.site_title" />
                </lew-form-item>
                <lew-form-item label="站点描述">
                    <lew-input placeholder="输入站点描述" v-model="userForm.site_description" type="textarea" />
                </lew-form-item>
                <lew-form-item label="关键词">
                    <lew-input placeholder="输入关键词" v-model="userForm.site_keywords" />
                </lew-form-item>

                <lew-form-item label="备案码">
                    <lew-input placeholder="输入备案码" v-model="userForm.record_code" />
                </lew-form-item>
                <lew-form-item y="center" label="社交媒体">
                    <lew-input placeholder="输入社交媒体" v-model="userForm.contact" />
                </lew-form-item>
                <lew-flex x="end">
                    <lew-button @click="save">保存信息</lew-button>
                </lew-flex>
            </lew-form>
        </lew-flex>
    </div>

</template>
<style lang="scss">
.user-wrapper {
    padding: 30px;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;

    .header {
        margin-bottom: 30px;
    }

    .user-box {
        max-width: 500px !important;
        margin: 0 auto;
        border-radius: var(--lew-border-radius);
        background-color: var(--lew-bgcolor-0);
        overflow: hidden;
        border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
        padding: 30px;
    }

    .form-box {
        width: 100%;
        padding: 15px;
        box-sizing: border-box;
    }

}

.head_img {
    object-fit: contain;
    border: 1px #eee solid;
}
</style>
