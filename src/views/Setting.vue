<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios/http';
let loading = ref(false);
let comment_switch = ref();
let site_switch = ref();

const changeCommentSwitch = () => {
    return new Promise((resolve) => {
        axios
            .put({
                url: '/api/blogger',
                data: {
                    comment_switch: !comment_switch.value
                }
            })
            .then((res: any) => {
                if (res.code == 200) {
                    resolve(true)
                    if (!comment_switch.value) {
                        LewMessage.success('已开启评论');
                        comment_switch.value = true;
                    } else {
                        LewMessage.error('已关闭评论');
                        comment_switch.value = false;
                    }
                } else {
                    resolve(false)
                }
            });
    });
};

const closeOk = () => {
    return new Promise((resolve) => {
        axios
            .put({
                url: '/api/blogger',
                data: {
                    site_switch: !site_switch.value
                }
            })
            .then((res: any) => {
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
                resolve(true);
            });
    });
};

const getBlogger = () => {
    loading.value = true;
    axios
        .get({
            url: '/api/blogger'
        })
        .then((res: any) => {
            if (res.code == 200) {
                comment_switch.value = res.data.comment_switch;
                site_switch.value = res.data.site_switch;
            }
        })
        .finally(() => {
            loading.value = false;
        });
};


onMounted(() => {
    getBlogger();
});
</script>
<template>
    <div class="setting-wrapper" v-show="!loading">
        <div gap="0px" class="setting-box">
            <lew-title>设置</lew-title>
            <br />
            <lew-form direction="y" x="start">
                <lew-form-item label="是否开启评论功能" class="info-item">
                    <lew-switch :request="changeCommentSwitch" v-model="comment_switch" />
                </lew-form-item>
            </lew-form>
            <br>
            <lew-popok :title="`${site_switch ? '关闭' : '开启'}`" type="error" :content="`${site_switch ? '确认关闭之后，前台将显示正在维护站点。' : '确认开启站点？'
            }`" placement="top" width="200px" :ok="closeOk">
                <lew-button v-show="site_switch" type="error">临时关闭站点</lew-button>
                <lew-button v-show="!site_switch" type="primary">开启站点</lew-button>
            </lew-popok>
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
        border-radius: var(--lew-border-radius);
        background-color: var(--lew-bgcolor-0);
        overflow: hidden;
        border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
        padding: 40px;
    }
}
</style>
