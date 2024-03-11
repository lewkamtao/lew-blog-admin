import { defineStore } from 'pinia';
import axios from '@/axios/http';

export const useState = defineStore({
    id: 'state', // id必填，且需要唯一
    state: () => {
        return {
            id: '',
            nickname: '',
            avatar: '',
            isLogin: false,
            loading: false
        };
    },
    actions: {
        getUser() {
            axios
                .get({
                    url: '/user',
                    baseURL: '/api_sso'
                })
                .then((res: any) => {
                    if (res.code === 200) {
                        const { nickname, avatar, id } = res.data;
                        this.nickname = nickname;
                        this.avatar = avatar;
                        this.id = id;
                        this.isLogin = true;
                    }
                });
        }
    }
});
