<template>
  <KTUpgradePlanModal />
  <KTCreateAppModal />
  <KTNewTargetModal />
  <KTViewUsersModal />
  <KTInviteFriendsModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTUpgradePlanModal from "@/components/modals/general/UpgradePlanModal.vue";
import KTNewTargetModal from "@/components/modals/forms/NewTargetModal.vue";
import KTViewUsersModal from "@/components/modals/general/ViewUsersModal.vue";
import KTInviteFriendsModal from "@/components/modals/general/InviteFriendsModal.vue";

export default defineComponent({
  name: "global-modals",
  components: {
    KTUpgradePlanModal,
    KTNewTargetModal,
    KTViewUsersModal,
    KTInviteFriendsModal,
  },
});
</script>
