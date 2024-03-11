import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, './env');
    return {
        base: '',
        resolve: {
            //设置别名
            alias: {
                '@': pathSrc
            }
        },
        plugins: [
            vue(),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'],
                dts: path.resolve(pathSrc, 'auto-imports.d.ts')
            })
        ],
        server: {
            port: 10003, //启动端口
            open: true,
            hmr: true,
            proxy: {
                '/api_admin': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api_admin/, '')
                },
                '/api_blog': {
                    target: env.VITE_API_BLOG_URL,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api_blog/, '')
                },
                '/api_sso': {
                    target: env.VITE_API_SSO_URL,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api_sso/, '')
                }
            }
        }
    };
});
