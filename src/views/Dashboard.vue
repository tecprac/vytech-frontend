<template>
    <div class="row">
        <div class="col-12">
            <div class="card card-flush h-lg-100 shadow">
                <div class="card-body">
                    <div class="card-px text-center my-10">
                        <h2 class="fs-2x fw-bold mb-10">VYTechServices</h2>
                    </div>
                    <div class="col-sm-12 text-center">
                        <img :src="getAssetPath('media/logos/logo_prodiesel_ok.png')" alt="Logo ProDiesel" width="800px" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
   
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "main-dashboard",
  components: {
    
  },
  setup() {
    
    return {
      getAssetPath,
    };
  },
});
</script>
