<template>
    <!--begin::Menu-->
    <div
        class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
        data-kt-menu="true">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
            <div class="menu-content d-flex align-items-center px-3">
                <!--begin::Avatar-->
                <div class="symbol symbol-50px me-5">
                    <img alt="Logo" :src="getAssetPath('media/avatars/vytechservices.png')" />
                </div>
                <!--end::Avatar-->

                <!--begin::Username-->
                <div class="d-flex flex-column">
                    <div class="fw-bold d-flex align-items-center fs-5">
                        {{ store.user.nombre }}
                    </div>
                </div>
                <!--end::Username-->
            </div>
        </div>
        <!--end::Menu item-->
        
        <div class="separator my-2"></div>

        <div class="menu-item px-5 text-start">
            <span class="fs-5 text-primary">Departamento: </span>{{ store.user.departamento }}
        </div>
        <div class="menu-item px-5 text-start">
            <span class="fs-5 text-primary">Rol: </span>{{ store.user.rol }}
        </div>
        <div class="menu-item px-5 text-start">
            <span class="fs-5 text-primary">Ultimo acceso: </span>{{ convertTMZdatetime(store.user.ultimo_acceso!) }}
        </div>
        
        <div class="separator my-2"></div>

        <!--begin::Menu item-->
        <div
            class="menu-item px-5" data-kt-menu-trigger="hover"
            data-kt-menu-placement="left-start" data-kt-menu-flip="center, top">
            <router-link to="/pages/profile/overview" class="menu-link px-5">
                <span class="menu-title position-relative">
                    Idioma
                    <span
                        class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
                        {{ currentLangugeLocale.name }}
                        <img class="w-15px h-15px rounded-1 ms-2" :src="currentLangugeLocale.flag" alt="Prodiesel"/>
                    </span>
                </span>
            </router-link>

            <!--begin::Menu sub-->
            <div class="menu-sub menu-sub-dropdown w-175px py-4">
                <!--begin::Menu item-->
                <div class="menu-item px-3">
                <a
                    @click="setLang('en')"
                    href="#"
                    class="menu-link d-flex px-5"
                    :class="{ active: currentLanguage === 'en' }"
                >
                    <span class="symbol symbol-20px me-4">
                    <img class="rounded-1"
                        :src="getAssetPath('media/flags/united-states.svg')" alt="Prodiesel" />
                    </span>
                    English
                </a>
                </div>
                <!--end::Menu item-->

                <!--begin::Menu item-->
                <div class="menu-item px-3">
                    <a
                        @click="setLang('es')" href="#"
                        class="menu-link d-flex px-5"
                        :class="{ active: currentLanguage === 'es' }">
                        <span class="symbol symbol-20px me-4">
                            <img class="rounded-1" :src="getAssetPath('media/flags/mexico.svg')" alt="Prodiesel" />
                        </span>
                        Español
                    </a>
                </div>
                <!--end::Menu item-->
            </div>
            <!--end::Menu sub-->
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-5 my-1">
            <router-link to="/pages/profile/overview" class="menu-link px-5">
                Acerca de VYTechServices...
            </router-link>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-5">
                <a @click="signOut()" class="menu-link px-5"> 
                    <i class="ki-duotone ki-entrance-left me-2" style="font-size: 2rem">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                     Cerrar Sesión
                </a>
        </div>
        <!--end::Menu item-->
    </div>
    <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import useUtilerias from "@/core/helpers/utilerias" ;

export default defineComponent({
    name: "kt-user-menu",
    components: {},
    setup() {
        const router = useRouter();
        const i18n = useI18n();
        const store = useAuthStore();
        const {
            convertTMZdatetime
        } = useUtilerias();

        i18n.locale.value = localStorage.getItem("lang")
            ? (localStorage.getItem("lang") as string)
            : "es";

        const countries = {
            es: {
                flag: getAssetPath("media/flags/mexico.svg"),
                name: "Español",
            },
            en: {
                flag: getAssetPath("media/flags/united-states.svg"),
                name: "English",
            },
        };

        const signOut = () => {
            store.logout();
            location.reload();
            router.push({ name: "sign-in" });
        };

        const setLang = (lang: string) => {
            localStorage.setItem("lang", lang);
            i18n.locale.value = lang;
        };

        const currentLanguage = computed(() => {
            return i18n.locale.value;
        });

        const currentLangugeLocale = computed(() => {
            return countries[i18n.locale.value as keyof typeof countries];
        });

        return {
            signOut,
            setLang,
            currentLanguage,
            currentLangugeLocale,
            countries,
            getAssetPath,
            store,
            convertTMZdatetime
        };
    },
});
</script>
