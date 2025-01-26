import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools({
            launchEditor: 'code'
        }),
    ],
    resolve: {
        alias: {
            "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    // base: "/metronic8/vue/demo1/",
    base: "/",
    build: {
        chunkSizeWarningLimit: 3000,
    },
    server: {
        port: 5184
    }
});
