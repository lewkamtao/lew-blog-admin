<script setup lang="ts">


const props = defineProps({
    modelValue: {
        type: String,
        default: 'javascript'
    }
});

let v = ref(props.modelValue);

const emit = defineEmits(["update:modelValue"])

watch((v), () => {
    emit("update:modelValue", v.value)
})


const options = [{
    label: "JavaScript",
    value: "javascript"
}, {
    label: "react",
    value: "react"
}, {
    label: "vue",
    value: "vue"
}, {
    label: "go",
    value: "go2"
}, {
    label: "html",
    value: "html"
}, {
    label: "css",
    value: "css"
}, {
    label: "Java",
    value: "java"
}, {
    label: "json",
    value: "json"
}, {
    label: "typescript",
    value: "typescript"
}, {
    label: "docker",
    value: "docker"
}, {
    label: "config",
    value: "config"
}, {
    label: "c",
    value: "c"
}, {
    label: "php",
    value: "php"
}, {
    label: "markdown",
    value: "markdown"
}, {
    label: "lua",
    value: "lua"
}, {
    label: "python",
    value: "python"
}, {
    label: "SQL",
    value: "db"
}, {
    label: "sass",
    value: "sass"
},]



</script> 

<template>
    <div class="select-icon">
        <div v-for="(item, index) in options" :key="index" class="item" :class="{ active: v == item.value }"
            @click="v = item.value">
            <i class="icon-seti" :class="('icon-' + item.value)"></i>
        </div>
    </div>
</template> 

<style lang="scss" scoped>
.select-icon {
    width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));

    .item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        cursor: pointer;
        border-radius: var(--lew-border-radius);
        box-sizing: border-box;

        i {

            font-size: 30px;
        }

        span {
            font-size: 14px;
        }
    }

    .active {
        border: 4px solid var(--lew-success-color);
    }



    .item:hover {
        background-color: #eee;
        border: 4px solid var(--lew-primary-color-light);
    }

    .active:hover {
        background-color: #fff;
        border: 4px solid var(--lew-success-color);
    }

}
</style>
 