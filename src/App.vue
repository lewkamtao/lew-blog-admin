<template>
    <div v-if="loading" v-loading="{ isShow: loading }" class="loading-wrapper">
    </div>
    <div v-else>
        <RouterView />
    </div>
</template>
<script lang="ts" setup>
import axios from '@/axios/http';

let loading = ref(true)

const router = useRouter()

const getUser = () => {
    loading.value = true;
    axios
        .get({
            url: '/api/blogger'
        }).then((res: any) => {
            if (res.code != 401) {
                if (res.code == 555) {
                    router.push('/Blogger');
                }
                loading.value = false;
            }

        })
}

onMounted(() => {
    getUser()
})

</script> 
<style lang="scss" scoped>
.loading-wrapper {
    position: fixed;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>