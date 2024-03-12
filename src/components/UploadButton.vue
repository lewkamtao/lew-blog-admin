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
    <lew-button
        type="light"
        color="gray"
        round
        icon="upload-cloud"
        :loading="loading"
        @click="openSelect"
    >
        {{ text }}
        <input
            v-show="false"
            id="file"
            ref="fileRef"
            type="file"
            name=""
            accept="image/*"
            @change="change"
        />
    </lew-button>
</template>
