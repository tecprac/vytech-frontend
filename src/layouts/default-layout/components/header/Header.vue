<template>
  <!--begin::Header-->
    <div v-if="headerDisplay"  id="kt_app_header" class="app-header"
        data-kt-sticky="true"
        data-kt-sticky-activate="{default: true, lg: true}"
        data-kt-sticky-name="app-header-minimize"
        data-kt-sticky-offset="{default: '200px', lg: '0'}"
        data-kt-sticky-animation="false"
    >
        <!--begin::Header container-->
        <div 
            class="app-container d-flex align-items-stretch justify-content-between bg-secondary"
            :class="{
                'container-fluid': headerWidthFluid,
                'container-xxl': !headerWidthFluid,
            }">

            <!-- begin: Card para informar sobre una nueva actualización -->
            <div class="notice d-flex bg-light-warning rounded border-primary border border-dashed min-w-lg-600px flex-shrink-0 mt-2 mb-2 p-6"
                v-if="versionActual.version_actual !== latestVersion">
                <div class="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
                    <div class="mb-3 mb-md-0 fv-semibold">
                        <h4 class="text-gray-800 fw-bold">
                            Existe una nueva versión de VYTechServices!
                        </h4>
                        <div class="fs-6 text-gray-600 pe-7">
                            Cierre la sesión para actualizar por favor. Nueva versión {{ versionActual?.version_actual }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- end: Card para informar sobre una nueva actualización -->
             
            <div
                v-if="layout === 'light-header' || layout === 'dark-header'"
                class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15"
            >
                <router-link to="/">
                <img
                    v-if="themeMode === 'light' && layout === 'light-header'"
                    alt="Logo"
                    :src="getAssetPath('media/logos/default.svg')"
                    class="h-20px h-lg-30px app-sidebar-logo-default theme-light-show"
                />
                <img
                    v-if="
                    layout === 'dark-header' ||
                    (themeMode === 'dark' && layout === 'light-header')
                    "
                    alt="Logo"
                    :src="getAssetPath('media/logos/default-dark.svg')"
                    class="h-20px h-lg-30px app-sidebar-logo-default"
                />
                </router-link>
            </div>
            <template v-else>
                <!--begin::sidebar mobile toggle-->
                <div class="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2">
                <div
                    class="btn btn-icon btn-active-color-primary w-35px h-35px"
                    id="kt_app_sidebar_mobile_toggle"
                >
                    <KTIcon icon-name="abstract-14" icon-class="fs-2 fs-md-1" />
                </div>
                </div>
                <!--end::sidebar mobile toggle-->
                <!--begin::Mobile logo-->
                <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                <router-link to="/" class="d-lg-none">
                    <img
                    alt="Logo"
                    :src="getAssetPath('media/logos/default-small.svg')"
                    class="h-30px"
                    />
                </router-link>
                </div>
                <!--end::Mobile logo-->
            </template>
            <!--begin::Header wrapper-->
            <div
                class="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
                id="kt_app_header_wrapper"
            >
                <KTHeaderMenu />
                <KTHeaderNavbar />
            </div>
            <!--end::Header wrapper-->
        </div>
        <!--end::Header container-->
    </div>
    <!--end::Header-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import KTHeaderMenu from "@/layouts/default-layout/components/header/menu/Menu.vue";
import KTHeaderNavbar from "@/layouts/default-layout/components/header/Navbar.vue";
import useParametros from "@/modules/configuracion/parametros/composables/useParametros";
import {
  headerDisplay,
  headerWidthFluid,
  layout,
  themeMode,
  headerDesktopFixed,
  headerMobileFixed,
} from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "layout-header",
  components: {
    KTHeaderMenu,
    KTHeaderNavbar,
  },
  setup() {
        const { versionActual } = useParametros();

        // const version = import.meta.env.VITE_APP_VERSION;
        const latestVersion     = ref<string>('');

        onMounted(() => {
            fetch(`/meta.json?${new Date().getTime()}`, { cache: 'no-cache' })
                .then((response) => response.json())
                .then((meta) => {
                    latestVersion.value = meta.version;
            });
        });
        return {
            layout,
            headerWidthFluid,
            headerDisplay,
            themeMode,
            getAssetPath,
            headerDesktopFixed,
            headerMobileFixed,
            versionActual,
            latestVersion,
        };
  },
});
</script>
