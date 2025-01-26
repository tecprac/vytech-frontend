<template>

    <HandleCache ref="cacheBuster">
        <template v-slot="{ isLoading, isLatestVersionAvailable }">
            <template v-if="isLoading">
                <h1>Cargando...</h1>
            </template>
            <template v-else-if="isLatestVersionAvailable">
                <RouterView />
            </template>
            <template v-else>
                {{ cacheBuster.clearCacheAndReload() }}
            </template>
        </template>
    </HandleCache>


    <!-- <RouterView /> -->
</template>

<script lang="ts">
import { ref, defineComponent, nextTick, onBeforeMount, onMounted } from "vue";
import HandleCache from '@/HandleCache.vue';
import { RouterView } from "vue-router";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { useBodyStore } from "@/stores/body";
import { themeConfigValue } from "@/layouts/default-layout/config/helper";
import { initializeComponents } from "@/core/plugins/keenthemes";

export default defineComponent({
    name: "app",
    components: {
        RouterView,
        HandleCache,
    },
    setup() {
        const configStore = useConfigStore();
        const themeStore = useThemeStore();
        const bodyStore = useBodyStore();
        const cacheBuster = ref();

        onBeforeMount(() => {
        /**
         * Overrides the layout config using saved data from localStorage
         * remove this to use static config (@/layouts/default-layout/config/DefaultLayoutConfig.ts)
         */
        configStore.overrideLayoutConfig();

        /**
         *  Sets a mode from configuration
         */
        themeStore.setThemeMode(themeConfigValue.value);
        });

        onMounted(() => {
            nextTick(() => {
                initializeComponents();

                bodyStore.removeBodyClassName("page-loading");
            });
        });

        return {
            cacheBuster
        }
    },
});
</script>

<style lang="scss">
@import "bootstrap-icons/font/bootstrap-icons.css";
@import "apexcharts/dist/apexcharts.css";
@import "quill/dist/quill.snow.css";
@import "animate.css";
@import "sweetalert2/dist/sweetalert2.css";
@import "nouislider/dist/nouislider.css";
@import "@fortawesome/fontawesome-free/css/all.min.css";
@import "socicon/css/socicon.css";
@import "line-awesome/dist/line-awesome/css/line-awesome.css";
@import "dropzone/dist/dropzone.css";
@import "@vueform/multiselect/themes/default.css";
@import "prism-themes/themes/prism-shades-of-purple.css";
@import "element-plus/dist/index.css";

// Main demo style scss
@import "assets/keenicons/duotone/style.css";
@import "assets/keenicons/outline/style.css";
@import "assets/keenicons/solid/style.css";
@import "assets/sass/element-ui.dark";
@import "assets/sass/plugins";
@import "assets/sass/style";

#app {
  display: contents;
}
</style>