<template>
  <div id="complienceSettings">
    <div class="d-flex align-items-center border mb-2">
      <p class="mb-0 mr-3 label-title setting-text">{{ element.name }}</p>
      <b-form-radio
        v-model="element.setting"
        class="mr-2 custom-control-right setting-text text-muted"
        value="every_time"
        >Everytime</b-form-radio
      >
      <b-form-radio
        v-model="element.setting"
        class="mr-2 custom-control-right setting-text text-muted"
        value="daily"
        >Daily
      </b-form-radio>
      <b-form-radio
        v-model="element.setting"
        class="mr-2 custom-control-right setting-text text-muted"
        value="weekly"
        >Weekly
      </b-form-radio>
      <b-form-radio
        v-model="element.setting"
        class="mr-2 custom-control-right setting-text text-muted"
        value="monthly"
        >Monthly
      </b-form-radio>
      <b-form-radio
        v-if="element.type == 'agreement' || element.type == 'questionnaire'"
        v-model="element.setting"
        class="mr-2 custom-control-right setting-text text-muted"
        value="once_off"
        >One-off
      </b-form-radio>
      <b-form-radio
        v-else
        v-model="element.setting"
        class="mr-2 custom-control-right setting-text text-muted"
        value="Valid_till_expiry"
        >Valid till expiry
      </b-form-radio>
      <i
        class="mdi mdi-delete ml-2"
        @click="deleteComplianceSetting(index)"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  props: ["element", "index", "deleteComplianceSetting"],
};
</script>
<style lang="scss" scobed>
#complienceSettings {
  .label-title {
    min-width: 100px;
  }
  .setting-text {
    white-space: nowrap;
  }
  .mdi-delete {
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.3s;
    color: #74788d;
    &:hover {
      color: #103f5e;
    }
  }
}
</style>
