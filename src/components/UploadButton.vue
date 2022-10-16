<script lang="ts" setup>
    import { ref } from 'vue';
    import { putFile } from '@/utils';

    defineProps({
        text: {
            type: String,
            default: '点击上传'
        }
    });

    let fileRef = ref();
    let loading = ref(false);

    const openSelect = () => {
        fileRef.value.dispatchEvent(new MouseEvent('click'));
    };
    const emit = defineEmits(['uploadSuccess']);
    const change = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            loading.value = true;
            putFile(file, `blog/${file.name}`)
                .then((res: any) => {
                    emit('uploadSuccess', res);
                })
                .finally(() => {
                    loading.value = false;
                });
        }
    };
</script>

<template>
    <lew-button type="normal" @click="openSelect" :loading="loading">
        <lew-icon style="margin-right: 5px" size="16" type="upload-cloud" /> {{ text }}
        <input
            v-show="false"
            type="file"
            name=""
            id="file"
            ref="fileRef"
            accept="image/*"
            @change="change"
        />
    </lew-button>
</template>
