<template>
    <!--begin::Statistics Widget 5-->
    <a href="#" :class="[widgetClasses, `bg-${color}`]" class="card hoverable">
        <!--begin::Body-->
        <div class="card-body">
            <div class="row">
                <div class="col-sm-2 me-5">
                    <KTIcon
                        :icon-name="iconName"
                        :icon-class="`text-${iconColor} fs-3x mx-n1`"
                    />
                </div>
                <div class="col-sm-4">
                    <div :class="`text-inverse-${color}`" class="fw-bold fs-1 mb-2 mt-5">
                        {{ title }}
                    </div>
                </div>
            </div>
            
        

            <div :class="`text-inverse-${color}`" class="fw-semibold fs-3">
                {{ description }}
            </div>
        </div>
        <!--end::Body-->
  </a>
  <!--end::Statistics Widget 5-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "kt-widget-5",
  props: {
    widgetClasses: String,
    color: String,
    iconColor: String,
    iconName: String,
    title: String,
    description: String,
  },
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
