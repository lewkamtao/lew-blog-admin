<script lang="ts" setup>

import UploadAdapter from "./upload";

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

let emit = defineEmits(["update:modelValue"])
let _editor: any
let setContentCount = 0

watch(
    () => props.modelValue,
    (v) => {
        if (setContentCount == 0 && v) {
            _editor.setData(v)
            setContentCount += 1
        }
    }
);


onMounted(() => {
    // @ts-ignore
    ClassicEditor
        .create(document.querySelector('#lew_editor'), {
            removePlugins: ["MediaEmbedToolbar"],
        }).then((editor: any) => {
            _editor = editor
            editor.ui.view.stickyPanel.unbind('isActive');
            editor.ui.view.stickyPanel.isActive = false;
            // 设置图片上传
            editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                return new UploadAdapter(loader);
            };
            // 监听内容变化 
            editor.model.document.on('change:data', (v: any) => {
                console.log(editor.getData());
                
                emit("update:modelValue", editor.getData())
            });

        })
})
</script>  

<template>
    <div>
        <div id="lew_editor">
        </div>
    </div>
</template>

<style lang="scss">
.ck-editor__top {
    position: sticky !important;
    top: 60px;
    z-index: 99;
}

.ck-toolbar {
    position: sticky;
    box-sizing: border-box;
    border: 1px solid var(--ck-color-toolbar-border) !important;
}

.ck-content {
    width: 800px;
    min-height: 600px;
    margin: 50px auto;
    padding: 15px 20px !important;
    box-sizing: border-box;
}
</style>
