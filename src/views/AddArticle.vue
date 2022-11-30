<script lang="ts" setup>
import axios from '@/axios/http';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import UploadButton from '@/components/UploadButton.vue';
import LewEditor from '@/components/LewEditor/LewEditor.vue';

const route = useRoute();
const router = useRouter();
let addModal = ref(false);
let options = ref([]);
let loading = ref(false);

let articleForm = ref({
    id: '',
    title: '',
    head_img: '',
    description: '',
    content: '',
    series_id: '',
    tags: [] as any
});

const getSeries = () => {
    loading.value = true;
    axios
        .get({
            url: '/api/series/list'
        })
        .then((res: any) => {
            if (res.code == 200) {
                options.value = res.data.map((e: any) => {
                    return {
                        label: e.title,
                        value: String(e.id)
                    };
                });
            }
        })
        .finally(() => {
            loading.value = false;
        });
};

const getArticle = () => {
    axios
        .get({
            url: '/api/article/' + route.query.id
        })
        .then((res: any) => {
            if (res.code == 200) {
                const { id, title, head_img, description, content, series_id, tags } = res.data;
                articleForm.value = {
                    id: id,
                    title: title,
                    head_img: head_img,
                    description: description,
                    content: content,
                    series_id: String(series_id),
                    tags: tags ? tags.map((e: any) => e.title) : []
                };
            }
        });
};

const save = () => {
    addModal.value = true;
};

const saveFn = () => {
    let data = JSON.parse(JSON.stringify(articleForm.value));
    data.tags = data.tags.map((e: any) => {
        return {
            title: e
        };
    });
    data.series_id = parseInt(data.series_id);

    if (data.id) {
        axios
            .put({
                url: '/api/article/' + data.id,
                data: data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('更新成功');
                    router.push('/Article');
                }
            });
    } else {
        delete data.id;
        axios
            .post({
                url: '/api/article',
                data: data
            })
            .then((res: any) => {
                if (res.code == 200) {
                    LewMessage.success('发布成功');
                    router.push('/Article');
                }
            });
    }
};

const openAddModal = () => {
    if (articleForm.value.title == '') {
        LewMessage.error('标题不能为空');
        return;
    }
    if (articleForm.value.content == '') {
        LewMessage.error('内容不能为空');
        return;
    }
    addModal.value = true;
};

onMounted(() => {
    getSeries();
    if (route.query.id) {
        getArticle();
    }
});
</script>
<template>
    <div v-loading="{ isShow: loading }">
        <lew-flex x="start" class="header">
            <input v-model="articleForm.title" type="text" placeholder="输入文章标题" />
            <lew-button class="add-button" @click="openAddModal">
                保存
            </lew-button>
        </lew-flex>
        <div class="editor-wrapper">
            <lew-editor v-model="articleForm.content"></lew-editor>
        </div>
        <!-- <v-md-editor placeholder="写点什么好呢？" v-model="articleForm.content" height="calc(100vh - 110px)" @save="save">
        </v-md-editor> -->
        <lew-modal :visible="addModal" width="400px">
            <div class="modal-body">
                <lew-title :bold="700" style="margin-bottom: 20px">{{ articleForm.id ? '更新文章' : '发布文章' }}
                </lew-title>
                <lew-form label-width="60px">
                    <lew-form-item label="封面图片">
                        <lew-flex direction="column" x="start">
                            <img v-show="articleForm.head_img" class="head_img" :src="articleForm.head_img" alt="" srcset="" />
                            <upload-button text="上传封面" @upload-success="(url) => (articleForm.head_img = url)" />
                        </lew-flex>
                    </lew-form-item>

                    <lew-form-item label="选择系列">
                        <lew-select v-model="articleForm.series_id" block :show-icon="false" :iconable="false"
                            :options="options"></lew-select>
                    </lew-form-item>

                    <lew-form-item label="添加标签">
                        <lew-input-tag v-model="articleForm.tags" type="info" />
                    </lew-form-item>
                    <lew-form-item style="margin-bottom: 30px" label="文章描述">
                        <lew-input v-model="articleForm.description" type="textarea" show-count :max-length="250" />
                    </lew-form-item>
                </lew-form>
                <lew-flex x="end">
                    <lew-button type="normal" @click="addModal = false">关闭 </lew-button>
                    <lew-button @click="saveFn">
                        保存
                    </lew-button>
                </lew-flex>
            </div>
        </lew-modal>
    </div>
</template>

<style lang="scss" scoped>
.header {
    position: sticky;
    top: 0px;
    height: 60px;
    padding: 0px 20px 0px 0px;
    z-index: 99;
    box-sizing: border-box;
    background-color: var(--lew-form-bgcolor);
    border: var(--lew-form-border-width) var(--lew-form-border-color) solid;
    transition: var(--lew-form-transition);

    input {
        width: 100%;
        height: 50px;
        border: none;
        outline: none;
        font-size: 20px;
        padding-left: 20px;
        background: none;
    }
}

.editor-wrapper {
    min-height: calc(100vh - 110px);
}

.header:focus-within {
    border: var(--lew-form-border-width) var(--lew-form-border-color-focus) solid;
    background-color: var(--lew-form-bgcolor-focus);
}

.modal-body {
    padding: 30px;

    .head_img {
        width: 100px;
        height: 100px;
        object-fit: contain;
    }
}
</style>
