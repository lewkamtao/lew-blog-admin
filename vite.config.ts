import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, __dirname);
    return {
        resolve: {
            //设置别名
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        plugins: [vue()],
        server: {
            port: 8080, //启动端口
            hmr: {
                host: 'localhost',
                port: 8080
            },
            // 设置代理
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, '')
                },
                '/sso': {
                    target: env.VITE_SSO_URL,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/sso/, '')
                }
            }
        }
    };
});
