<script lang="ts" setup>
    import axios from '@/axios/http';

    const options = ref([{ label: '全部', value: '' }]);

    const props = defineProps({
        value: {
            type: String,
            default: ''
        }
    });

    let _value = ref();

    const emit = defineEmits(['update:modelValue']);

    watch(
        () => props.value,
        (v) => {
            _value.value = v;
        }
    );

    const change = () => {
        emit('update:modelValue', _value.value);
    };

    const getType = () => {
        axios
            .get({
                url: '/dic/list?page=1&limit=2000&pids=327'
            })
            .then((res: any) => {
                if (res.code == 200) {
                    options.value = options.value.concat(
                        res.data.map((e: any) => {
                            return {
                                ...e,
                                label: e.name,
                                value: String(e.id)
                            };
                        })
                    );
                }
            });
    };

    onMounted(() => {
        getType();
    });
</script>

<template>
    <lew-tabs
        v-if="options.length > 1"
        v-model="_value"
        style="width: 100%; margin-bottom: 20px"
        type="line"
        :options="options"
        @change="change"
    />
</template>
