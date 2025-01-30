<template>
    <!--begin::Footer-->
    <div v-if="footerDisplay" id="kt_app_footer" class="app-footer">
        <!--begin::Footer container-->
        <div class="app-container d-flex flex-column flex-md-row flex-center flex-md-stack py-3 bg-secondary"
            :class="{
            'container-fluid': footerWidthFluid,
            'container-xxl': !footerWidthFluid,
            }">
            <!--begin::Copyright-->
            <div class="text-gray-900 order-2 order-md-1">
                <span class="text-muted fw-semibold me-1">2025©</span>
                <a href="https://vytechservices.com.mx"
                    target="_blank"
                    class="text-gray-800 text-hover-primary">
                    {{ appName }} Ver. {{ latestVersion }}
                </a>
            </div>
            <!--end::Copyright-->
            <!--begin::Menu-->
            <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                <li class="menu-item">
                    <a href="https://tecnologiapractica.com.mx"
                        target="_blank"
                        class="menu-link px-2">
                        Creado por: Tecnología Práctica
                    </a>
                </li>
            </ul>
            <!--end::Menu-->
        </div>
        <!--end::Footer container-->
    </div>
    <!--end::Footer-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { footerDisplay, footerWidthFluid } from "@/layouts/default-layout/config/helper";

export default defineComponent({
    name: "theme-footer",
    components: {},
    setup() {

        const latestVersion     = ref<number>();
        const appName           = ref<string>(import.meta.env.VITE_APP_NAME);

        onMounted(() => {
            fetch(`/meta.json?${new Date().getTime()}`, { cache: 'no-cache' })
                .then((response) => response.json())
                .then((meta) => {
                    latestVersion.value = meta.version;
            });
        });

        return {
            appName,

            footerWidthFluid,
            footerDisplay,
            latestVersion
        };
    },
});
</script>