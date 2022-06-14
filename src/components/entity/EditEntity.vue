<script>
import { mapActions, mapGetters } from "vuex";
import { numeric } from "vuelidate/lib/validators";

export default {
  name: "EntityForm",
  data() {
    return {
      id: null,
      form: {
        entity: {
          company_phone: null,
          package: "Standalone",
        },
        entity_setting: {
          temperature_display_unit_for_company: null,
        },
      },
      submitted: false,
    };
  },
  validations: {
    form: {
      entity: {
        company_phone: { numeric },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("authfack", ["userDetails"]),
    ...mapGetters("entity", [
      "getEntities",
      "getLoading",
      "getIsValidSubdomian",
    ]),
    userEmail() {
      return this.userDetails && this.userDetails.email;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("editEntity");
    },
  },
  methods: {
    ...mapActions("entity", ["updateEntity"]),
    onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const { id, form, updateEntity } = this;
        updateEntity({
          id: id,
          params: form,
        });
      }
    },
  },
  beforeMount() {
    const { getModalInfo } = this;
    if (getModalInfo) {
      console.log('edit compan', this.getModalInfo);
      this.id = getModalInfo.id;
      this.form.entity.company_phone = getModalInfo.company_phone;
      this.form.entity.company_email = getModalInfo.company_email;
      this.form.entity.package = getModalInfo.package;
      this.form.entity_setting.temperature_display_unit_for_company =
        getModalInfo.setting[0].pivot.value;
    }
  },
};
</script>

<template>
  <div class="kiosk-form-wrapper">
    <div class="form-groups">
      <p class="text-secondary mb-3">Edit Company</p>
      <!-- package  -->
      <b-form-group
        v-if="userEmail == 'lt_techteam@visipoint.com'"
        label-cols-sm="4"
        label-cols-lg="4"
        label="Company Service:"
      >
        <div class="form-radio-wrapper mt-2 d-flex align-items-center">
          <b-form-radio
            v-model="form.entity.package"
            name="standalone"
            value="Standalone"
            >Standalone</b-form-radio
          >
          <b-form-radio
            class="mx-3"
            v-model="form.entity.package"
            name="cloud"
            value="Cloud"
            >Cloud</b-form-radio
          >
        </div>
      </b-form-group>
      <!-- phone  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label="Company Phone:"
        label-for="phone"
      >
        <b-form-input
          id="phone"
          v-model="form.entity.company_phone"
          type="text"
          placeholder="Enter Phone"
          :class="{
            'is-invalid': submitted && $v.form.entity.company_phone.$error,
          }"
        ></b-form-input>
        <div
          v-if="submitted && !$v.form.entity.company_phone.numeric"
          class="invalid-feedback"
        >
          Phone number should contain only digits.
        </div>
      </b-form-group>
      <!-- Temperature Unit -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="Temperature Unit:"
        label-for="temperature"
      >
        <div class="d-flex align-items-center" style="margin-top: 4%">
          <b-form-radio
            v-model="form.entity_setting.temperature_display_unit_for_company"
            value="f"
            >°F</b-form-radio
          >
          <b-form-radio
            class="mx-3"
            v-model="form.entity_setting.temperature_display_unit_for_company"
            value="c"
            >°C</b-form-radio
          >
        </div>
      </b-form-group>
    </div>
    <!-- action btns  -->
    <div class="d-flex justify-content-end align-items-center mt-2">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('editEntity')"
      >
        Cancel
      </button>
      <button
        class="submit-btn btn btn-primary px-4"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span v-else>
          Update
        </span>
      </button>
    </div>
  </div>
</template>
