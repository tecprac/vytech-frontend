<template>
  <KTModalCard
    title="Two-factor Authentication"
    description="Click on the below buttons to launch <br/>two-factor authentication setup example."
    :image="getIllustrationsPath('4.png')"
    button-text="Enable Two-factor Authentication"
    modal-id="kt_modal_two_factor_authentication"
  ></KTModalCard>

  <KTTwoFactorAuthModal></KTTwoFactorAuthModal>
</template>

<script lang="ts">
import { getAssetPath, getIllustrationsPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTModalCard from "@/components/cards/Card.vue";

export default defineComponent({
  name: "two-factor-auth",
  components: {
    KTModalCard,
  },
  setup() {
    return {
      getIllustrationsPath,
      getAssetPath,
    };
  },
});
</script>
