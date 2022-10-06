<script lang="ts" setup>
import axios from '@/axios/http';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let form = ref({
    username: 'admin',
    password: 'admin'
});

const login = () => {
    axios
        .post({
            url: `/login`,
            data: {
                username: form.value.username,
                password: form.value.password
            }
        })
        .then((res: any) => {
            if (res.code == 200) {
                LewMessage.success('登录成功');
                localStorage.setItem('token', res.data);
                router.push('/');
            }
        });
};
</script>

<template>
    <lew-flex class="login-wrapper">
        <div class="left"> </div>
        <lew-flex direction="column" class="right">
            <div class="form">
                <lew-title>Lew-Blog</lew-title>
                <br />
                <lew-form direction="y">
                    <lew-form-item label="用户名">
                        <lew-input v-model="form.username" />
                    </lew-form-item>
                    <lew-form-item label="密码">
                        <lew-input v-model="form.password" type="password" />
                    </lew-form-item>
                </lew-form>
                <br />
                <lew-button style="width: 100%" @click="login"> 登录 </lew-button>
            </div>
        </lew-flex>
    </lew-flex>
</template>  

<style lang="scss">
.login-wrapper {
    width: 100%;
    height: 100vh;

    .left,
    .right {
        width: 50% !important;
        height: 100%;
    }

    .left {
        background-color: var(--lew-primary-color);
    }

    .form {
        width: 280px;
    }
}
</style>
