<template>
  <!--begin::Footer-->
  <div
    class="app-sidebar-footer flex-column-auto pt-2 pb-6 px-6"
    id="kt_app_sidebar_footer"
  >
    <a
      href="https://vytechservices.com.mx"
      class="btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100"
      data-bs-toggle="tooltip"
      data-bs-trigger="hover"
      data-bs-dismiss-="click"
      target="_blank"
      title="VYTechServices"
    >
      <span class="btn-label">DOCUMENTACIÓN</span>
      <KTIcon icon-name="document" icon-class="btn-icon fs-2 m-0" />
    </a>
  </div>
  <!--end::Footer-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "sidebar-footer",
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
