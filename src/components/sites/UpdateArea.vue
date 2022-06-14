<script>
import { mapActions, mapGetters } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  name: "UpdateActionForm",
  components: { Multiselect },
  data() {
    return {
      siteInfoLength: null,
      journey: null,
      originalSelectedJourney: null,
      showOptions: false,
      loginModeOptions: [
        { text: "Check in only", value: "checkIn_only" },
        {
          text: "Sign in / Sign out",
          value: "signIn_signOut",
        },
      ],

      signOutModeOptions: [
        { text: "At midnight", value: "at_midnight" },
        { text: "After 24 hours", value: "after_24_hours" },
      ],
      applyJourneyToOptions: [
        { text: "All kiosks inside this area", value: 1 },
        { text: "Kiosks that inherit the journey from this area", value: 0 },
      ],
      area: { id: null, name: "Assigned As Parent" },
      areaId: null,
      areaOptions: [],
      form: {
        area: {
          name: null,
          description: null,
          // settings: {
          login_mode: "checkIn_only",
          auto_sign_out: false,
          sign_out_mode: "at_midnight",
          auto_sign_out_email_notification: 0,
          // },
        },
        applayAll: null,
      },
      submitted: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
      update: false,
      action: null,
      hasParent: false,
      areas: [],
      parentId: null,
    };
  },
  validations: {
    form: {
      area: {
        name: {
          required,
          maxLength: maxLength(20),
        },
        description: {
          maxLength: maxLength(255),
        },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("sites", [
      "getLoading",
      "getAreas",
      "getAreasMode",
      "getIsSignInOutMode",
    ]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("journey", ["getJourneyList"]),
    disableBtn() {
      const { name } = this.form.area;
      // check if the modal is for update area we dimit btn for name and journey else we add site with area
      return (
        this.siteInfoLength
          ? name && this.journey
          : name && this.area && this.journey
      )
        ? false
        : true;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("updateArea");
    },
    getAreas(areas) {
      console.log("watch", areas);
      this.areaOptions = JSON.parse(JSON.stringify(areas));
      return this.areaOptions.push({ id: null, name: "Assigned As Parent" });
    },
    area(area) {
      console.log("watch area", area);
      if (area && area.id) this.checkSignInOutMode(area.id);
      else {
        const choiceFound = this.loginModeOptions.find(
          (item) => item.text == "Sign in / Sign out"
        );
        if (!choiceFound)
          this.loginModeOptions.push({
            text: "Sign in / Sign out",
            value: "signIn_signOut",
          });
      }
    },
    journey(journey) {
      console.log("journey changed");
      if (journey.id !== this.originalSelectedJourney.id) {
        this.showOptions = true;
        this.form.applayAll = 0;
      } else {
        this.showOptions = false;
        this.form.applayAll = null;
      }
    },
    getIsSignInOutMode(getIsSignInOutMode) {
      console.log("getIsSignInOutMode", getIsSignInOutMode);
      if (getIsSignInOutMode) {
        const choiceFound = this.loginModeOptions.find(
          (item) => item.text == "Sign in / Sign out"
        );
        if (choiceFound) this.loginModeOptions.splice(1, 1);
      } else {
        const choiceFound = this.loginModeOptions.find(
          (item) => item.text == "Sign in / Sign out"
        );
        if (!choiceFound)
          this.loginModeOptions.push({
            text: "Sign in / Sign out",
            value: "signIn_signOut",
          });
      }
    },
  },
  methods: {
    ...mapActions("sites", [
      "updateArea",
      "createArea",
      "fetchSites",
      "fetchAreasBySite",
      "checkSignInOutMode",
    ]),
    ...mapActions("journey", ["fetchJourneyList"]),
    onSubmit() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.form.area.journey_id = this.journey.id;
      // this.form.applayAll = truei;
      this.form.area.settings = {
        auto_sign_out: this.form.area.auto_sign_out ? 1 : 0,
        login_mode: this.form.area.login_mode,
        sign_out_mode: this.form.area.sign_out_mode,
        auto_sign_out_email_notification: this.form.area
          .auto_sign_out_email_notification
          ? 1
          : 0,
      };
      console.log("this.form", this.form, this.areaId);
      this.siteInfoLength
        ? this.updateArea({
            id: this.areaId,
            params: this.form,
          })
        : ((this.form.area.parent_id = this.area.id),
          (this.form.area.site_id = this.$route.params.id),
          this.createArea({
            params: this.form,
          }));
    },
    requestAreas() {
      this.fetchJourneyList();
    },
  },
  beforeMount() {
    console.log("getAreas", this.getAreas);
    // console.log("getmodalinfo", this.getModalInfo);
    // if (
    //   !this.getAreasMode ||
    //   (this.getModalInfo.setting &&
    //     this.getModalInfo.setting[0].pivot.value == "signIn_signOut")
    // )
    //   this.loginModeOptions.push({
    //     text: "Sign in / Sign out",
    //     value: "signIn_signOut",
    //   });
    // get areas by site id
    this.fetchAreasBySite(this.$route.params.id);
    this.fetchJourneyList();
    this.siteInfoLength =
      this.getModalInfo && Object.keys(this.getModalInfo).length > 0
        ? true
        : false;
    if (this.siteInfoLength) {
      console.log("gg", this.getModalInfo);
      if (this.getModalInfo.setting[0].pivot.value == "checkIn_only")
        this.checkSignInOutMode(this.getModalInfo.id);
      const { id, name, description, journey_id } = this.getModalInfo;
      this.areaId = id;
      this.form.area.name = name;
      this.form.area.description = description;
      // journeys
      this.getJourneyList.length > 0 &&
        this.getJourneyList.map((journey) => {
          journey.id == journey_id
            ? (this.journey = this.originalSelectedJourney = journey)
            : "";
          console.log("journey", this.journey);
        });

      this.form.area.login_mode = this.getModalInfo.setting[0].pivot.value;
      this.form.area.auto_sign_out =
        this.getModalInfo.setting[1] &&
        this.getModalInfo.setting[1].pivot.value == "1";
      this.form.area.sign_out_mode = this.getModalInfo.setting[2]
        ? this.getModalInfo.setting[2].pivot.value
        : "at_midnight";
      this.form.area.auto_sign_out_email_notification =
        this.getModalInfo.setting[3] &&
        this.getModalInfo.setting[3].pivot.value == "1"
          ? true
          : false;
    }
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-secondary mb-3">
      {{ siteInfoLength ? "Edit Area" : "Add Area" }}
    </p>
    <div class="form-groups">
      <!-- name   -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="name-group"
        label="Name"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="form.area.name"
          type="text"
          placeholder="Enter Name"
          :class="{
            'is-invalid': submitted && $v.form.area.name.$error,
          }"
        ></b-form-input>
        <div v-if="submitted && $v.form.area.$error" class="invalid-feedback">
          <span v-if="submitted && !$v.form.area.name.required"
            >Name is required.</span
          >
          <span v-else-if="submitted && !$v.form.area.name.maxLength"
            >The maximum length is
            {{ $v.form.area.name.$params.maxLength.max }} characters</span
          >
        </div>
      </b-form-group>
      <!-- desc  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="description"
        label="Description"
        label-for="Description"
      >
        <b-form-textarea
          id="description"
          v-model="form.area.description"
          type="text"
          placeholder="Enter Area Description"
          :class="{
            'is-invalid x-position':
              submitted && $v.form.area.description.$error,
          }"
        ></b-form-textarea>
        <div
          v-if="submitted && $v.form.area.description.$error"
          class="invalid-feedback"
        >
          <span v-if="submitted && !$v.form.area.description.maxLength">
            The maximum length is
            {{ $v.form.area.description.$params.maxLength.max }} characters
          </span>
        </div>
      </b-form-group>
      <!-- area  -->
      <b-form-group
        v-if="!siteInfoLength"
        label-cols-sm="4"
        label-cols-lg="3"
        id="name-group"
        label=" Assigned Area"
        label-for="area"
      >
        <multiselect
          id="area"
          v-model="area"
          :options="areaOptions"
          placeholder="Select Area"
          :show-labels="false"
          label="name"
          :allowEmpty="true"
        />
      </b-form-group>
      <p
        class="h5 mb-2"
        style="color: DODGERBLUE; font-size: 14px"
        v-if="getIsSignInOutMode && !siteInfoLength"
      >
        <template
          v-if="area && area.id && area.loginMode == 'Sign In / Sign Out'"
        >
          <b-icon icon="info-circle"></b-icon>
          <i>
            The selected area has a “Sign in / Sign out“ and none of its sub
            areas should have the same mode.
          </i></template
        >

        <template v-else-if="area && area.id">
          <b-icon icon="info-circle"></b-icon>
          <i>
            One of the parents of the selected area has a "Sign in / Sign out"
            login mode and none of its sub areas should have the same mode.
          </i>
        </template>
      </p>

      <!-- journey  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="journey"
        label="Select Journey"
        label-for="journey"
      >
        <multiselect
          id="journey"
          v-model="journey"
          :options="getJourneyList"
          placeholder="Select Journey"
          :show-labels="false"
          label="name"
          :allowEmpty="true"
          @open="requestAreas"
        />
      </b-form-group>

      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="applyJourneyTo"
        label="Apply journey to"
        label-for="applyJourneyTo"
        v-if="siteInfoLength && showOptions"
      >
        <div class="flex-row mb-5">
          <b-form-group
            class="custom-radios custom-activeRadio signout-mode"
            v-slot="{ ariaDescribedbyThree }"
          >
            <b-form-radio-group
              class="topPadding"
              id="radio-group-3"
              :options="applyJourneyToOptions"
              :aria-describedby="ariaDescribedbyThree"
              name="radio-optionsThree"
              v-model="form.applayAll"
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </b-form-group>

      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="loginMode"
        label="Login Mode"
        label-for="loginMode"
        class="label-positionLogin"
      >
        <!-- <div class="flex-row mb-5"> -->
        <b-form-group
          class="custom-radios custom-activeRadio login-mode"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio-group
            id="radio-group-1"
            :options="loginModeOptions"
            :aria-describedby="ariaDescribedby"
            name="radio-options"
            v-model="form.area.login_mode"
            class="topPadding"
          ></b-form-radio-group>
        </b-form-group>
        <!-- </div> -->
      </b-form-group>
      <p
        class="h5 mb-2"
        style="color: #f46a6a; font-size: 14px"
        v-if="
          getModalInfo &&
          getModalInfo.setting &&
          getModalInfo.countUsersSingnedIn &&
          form.area.login_mode == 'checkIn_only' &&
          getModalInfo.setting[0].pivot.value == 'signIn_signOut'
        "
      >
        <b-icon icon="info-circle-fill"></b-icon>
        There are {{ getModalInfo.countUsersSingnedIn }} active visits in this area, their statuses will no longer be “Signed in“ or “Auto signed in“.
      </p>

      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="autoSignOut"
        label="Auto Sign out"
        label-for="autoSignOut"
        v-if="form.area.login_mode == 'signIn_signOut'"
      >
        <!-- <div> -->
        <b-form-checkbox
          class="switch-gray radio-updateArea"
          v-model="form.area.auto_sign_out"
          name="check-button"
          switch
        >
          <!-- <b>(Checked: {{ autoSignOut }})</b> -->
        </b-form-checkbox>
        <!-- </div> -->
      </b-form-group>

      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="signOutMode"
        label="Sign out Mode"
        label-for="signOutMode"
        v-if="
          form.area.login_mode == 'signIn_signOut' && form.area.auto_sign_out
        "
      >
        <div class="flex-row mb-5">
          <b-form-group
            class="custom-radios custom-activeRadio signout-mode"
            v-slot="{ ariaDescribedbyTwo }"
          >
            <b-form-radio-group
              class="topPadding"
              id="radio-group-2"
              :options="signOutModeOptions"
              :aria-describedby="ariaDescribedbyTwo"
              name="radio-optionsTwo"
              v-model="form.area.sign_out_mode"
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </b-form-group>

      <b-form-group
        v-if="
          form.area.login_mode == 'signIn_signOut' && form.area.auto_sign_out
        "
      >
        <b-form-checkbox
          name="check-button"
          v-model="form.area.auto_sign_out_email_notification"
          >Notify users by email when they are auto signed out from this
          area.</b-form-checkbox
        >
      </b-form-group>
    </div>
    <div class="action-btns">
      <button
        :disabled="getLoading || disableBtn"
        class="submit-btn btn btn-primary"
        size="md"
        @click="onSubmit"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        {{ siteInfoLength > 0 ? "Update" : "Submit" }}
      </button>
      <button
        class="btn btn-outline-danger cancel-btn"
        @click="$bvModal.hide('updateArea')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topPadding {
  padding-top: 0.8rem;
}
.update-user-type-wrapper {
  select {
    word-wrap: normal;
    display: block;
    width: 100%;
    height: calc(1.5em + 0.94rem + 2px);
    padding: 0.47rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
  }
  .header {
    background-color: #f8f8fb;
    padding: 1% 0px;
    margin-bottom: 5%;
  }
  .form-groups {
    padding-bottom: 1%;
    margin-bottom: 40px;
    .x-position {
      background-position: top calc(0.375em + 0.235rem) right
        calc(0.375em + 0.535rem) !important;
    }
  }
  .modal-title {
    text-align: center;
    font-size: 19px;
    font-weight: 700;
  }
  .input-label {
    width: 400px;
  }
}
</style>
