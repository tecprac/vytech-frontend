<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ email: '', password: '' }"
    >
        <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
            <img alt="Logo" :src="getAssetPath('media/logos/custom-1.png')" class="h-60px h-lg-75px" />
        </div>
        
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3">Bienvenido!!!</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-gray-500 fw-semibold fs-4">
          Nos alegra verte!

          <router-link to="/sign-up" class="link-primary fw-bold">
            Inicia sesión con tu cuenta
          </router-link>
        </div>
        <!--end::Link-->
      </div>

      
      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900">Email / Usuario</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="email"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0">Password</label>
          <!--end::Label-->

          <!--begin::Link-->
          <router-link to="/password-reset" class="link-primary fs-6 fw-bold">
            Olvido su contraseña?
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> Entrar </span>

          <span class="indicator-progress">
            Por favor espere...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
        
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { setLocale } from "yup";

export default defineComponent({
    name: "sign-in",
    components: {
        Field,
        VForm,
        ErrorMessage,
    },
    setup() {

        setLocale({
            number: {
                min: 'Deber ser mayor que ${min}'
            },
            string: {
                min: 'Debe contener al menos ${min} caracteres'
            }
        });

        const store         = useAuthStore();
        const router        = useRouter();
        const submitButton  = ref<HTMLButtonElement | null>(null);

        //Create form validation object
        const login = Yup.object().shape({
            email: Yup.string().min(6).required().label("Usuario / Correo electrónico"),
            password: Yup.string().min(6).required().label("Password"),
        });

        //Form submit function
        const onSubmitLogin = async (values: any) => {
        values = values as User;
        // Clear existing errors
        store.logout();

        if (submitButton.value) {
            // eslint-disable-next-line
            submitButton.value!.disabled = true;
            // Activate indicator
            submitButton.value.setAttribute("data-kt-indicator", "on");
        }

        // Send login request
        await store.login(values);
        const error = Object.values(store.errors);
        const errormsg = store.errormsg;

        if (errormsg.length === 0) {
            Swal.fire({
            text: "Tu credenciales han sido verificadas, correctamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Listo para Ingresar!",
            heightAuto: false,
            customClass: {
                confirmButton: "btn fw-semibold btn-light-primary",
            },
            }).then(() => {
                // Go to page after successfully login
                router.push({ name: "dashboard" });
            });
        } else {
            Swal.fire({
                text: errormsg,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Error de conexión, intentalo nuevamente!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn fw-semibold btn-light-danger",
                },
            }).then(() => {
                store.errors = {};
                store.errormsg = '';
            });
        }

        //Deactivate indicator
        submitButton.value?.removeAttribute("data-kt-indicator");
        // eslint-disable-next-line
            submitButton.value!.disabled = false;
        };

        return {
        onSubmitLogin,
        login,
        submitButton,
        getAssetPath,
        };
    },
});
</script>
