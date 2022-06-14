<template>
  <section>
    <b-modal
      id="touchModeAlert"
      hide-footer
      hide-header
      size="lg"
      :scrollable="false"
    >
      <TouchModeAlert />
    </b-modal>
    <p class="page-title">Journey Builder</p>
    <div class="journey-form wrapper">
      <p class="form-title">
        {{
          $route.name == "updateJourney" ? "Update Journey" : "Create Journey"
        }}
      </p>
      <div class="content">
        <div class="journey-name">
          <div class="input-wrapper">
            <div class="form-group m-d-group">
              <b-form-input
                id="name"
                name="name"
                type="text"
                v-model="journey.name"
                required
              />
              <label for="name">Journey Name</label>
            </div>
          </div>
          <div class="err-wrapper">
            <div v-if="submitted && !$v.journey.name.minLength">
              <span class="error-value"
                >Name should be at least 2 characters.</span
              >
            </div>
            <div v-if="submitted && !$v.journey.name.maxLength">
              <span class="error-value"
                >The maximum length is 30 characters.</span
              >
            </div>
          </div>
        </div>
        <div class="custom-text-area">
          <b-form-textarea
            v-model="journey.description"
            id="description"
            placeholder="Journey Description"
            rows="10"
            no-resize
          ></b-form-textarea>
        </div>
        <div class="instructions-content" v-if="$route.name == 'updateJourney'">
          <hr class="h-line" />
          <div class="user-types">
            <p class="text-title">Instruction screen (Non touch mode)</p>
            <p
              v-if="getJourneyUserTypes && getJourneyUserTypes.length > 0"
              class="subtitle"
            >
              Shown User Types:
            </p>
            <div
              v-if="getJourneyUserTypes && getJourneyUserTypes.length > 0"
              class="user-types-checks"
            >
              <b-form-checkbox-group v-model="selected" size="lg">
                <b-form-checkbox
                  v-for="type in getJourneyUserTypes"
                  :key="type.id"
                  :value="type.id"
                  unchecked-value="not_accepted"
                  class="custom-checkbox-secondary custom-checkbox"
                >
                  <p class="text">{{ type.name }}</p>
                </b-form-checkbox>
              </b-form-checkbox-group>
            </div>
          </div>
          <div class="vaccine-input">
            <div class="input-wrapper">
              <div class="form-group m-d-gruop">
                <b-form-input
                  id="vaccine"
                  name="vaccine"
                  type="text"
                  v-model="vaccine_column_name"
                  required
                />
                <label for="vaccine">Covid Column Name</label>
              </div>
              <div class="err-wrapper">
                <div v-if="submitted && !$v.vaccine_column_name.maxLength">
                  <span class="error-value"
                    >The maximum length is 13 characters.</span
                  >
                </div>
              </div>
            </div>
          </div>
          <hr class="h-line" />
        </div>
        <hr v-if="$route.name != 'updateJourney'" class="h-line" />
        <!-- touch mode  -->
        <div class="touch-mode" @click="onUpdateTouchMode">
          <p class="label">Touch Mode:</p>
          <b-form-checkbox
            class="switch-gray"
            switch
            size="lg"
            v-model="touch_mode"
            :disabled="disable_touch_mode"
          ></b-form-checkbox>
        </div>

        <div class="name-match" v-if="touch_mode">
          <div class="flex-row mb-5">
            <b-form-group class="custom-radios custom-activeRadio" v-slot="{ ariaDescribedbyTwo }">
              <b-form-radio-group
              active-class="activeRadio"
                id="radio-group-2"
                :options="nameMatchOptions"
                :aria-describedby="ariaDescribedbyTwo"
                name="radio-optionsTwo"
                v-model="name_match_mode"
              ></b-form-radio-group>
            </b-form-group>
          </div>
        </div>
      </div>
      <div class="actions">
        <button
          @click="onJourneySubmit"
          :disabled="!journey.name || getLoading"
          class="submit-btn btn btn-primary"
          size="md"
        >
          <i
            v-if="getLoading"
            class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          ></i>
          <span v-else>{{
            $route.name == "updateJourney" ? "Update" : "Next"
          }}</span>
        </button>
        <router-link to="/journeys">
          <button class="btn btn-outline-primary cancel-btn">Cancel</button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import store from "@/state/store";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import TouchModeAlert from "@/components/journeyBuilder/TouchModeAlert";
export default {
  name: "SubmitJourney",
  components: { TouchModeAlert },
  data() {
    return {
      journey: {
        name: null,
        description: "",
        entity_id: null,
      },
      submitted: false,
      vaccine_column_name: null,
      journey_id: null,
      selected: [],
      userTypes: [],
      touch_mode: false,
      name_match_mode: "QUICK",
      disable_touch_mode: false,
      nameMatchOptions: [
        { text: "Quick name match", value: "QUICK" },
        { text: "Private name match", value: "PRIVATE" },
      ],
    };
  },
  validations: {
    journey: {
      name: { minLength: minLength(2), maxLength: maxLength(30) },
      description: "",
    },
    name_match_mode: {
      required,
    },
    vaccine_column_name: { maxLength: maxLength(13) },
  },
  computed: {
    ...mapGetters("journey", [
      "getLoading",
      "getJourneyUserTypes",
      "getJourneyDetails",
      "getJourneyInputs",
    ]),
  },
  watch: {
    getJourneyDetails(data) {
      // console.log('getjourneydetails', data);
      const { name, description, id, settings } = data;
      this.journey_id = id;
      this.journey.name = name;
      this.journey.description = description;
      settings &&
        settings.length > 0 &&
        settings.map((type) => {
          if (type.name == "show_instructions" && type.pivot.value) {
            let newTypes = this.userTypes;
            let oldTypes = JSON.parse(type.pivot.value).filter(Boolean);

            const differantID = newTypes.filter(
              ({ userTypeId: id1 }) =>
                !oldTypes.some(({ userTypeId: id2 }) => id2 === id1)
            );

            this.userTypes = Array.from(new Set(oldTypes.concat(differantID)));

            this.userTypes.map((type) => {
              if (type.show == true) {
                this.selected.push(type.userTypeId);
              }
            });
          } else if (type.name == "vaccine_column_name") {
            this.vaccine_column_name = type.pivot.value;
          } else if (type.name == "touch_mode") {
            this.touch_mode = type.pivot.value == "1" ? true : false;
          } else if (type.name == "name_match_mode") {
            this.name_match_mode = this.touch_mode ? type.pivot.value : 'QUICK';
          }
        });
    },
    getJourneyUserTypes(types) {
      types &&
        types.length > 0 &&
        (this.userTypes = types.map((type) => {
          return { userTypeId: type.id, show: false };
        }));
    },
    selected(selected) {
      const { userTypes } = this;
      for (let prop in userTypes) {
        {
          selected.includes(userTypes[prop].userTypeId)
            ? (userTypes[prop].show = true)
            : (userTypes[prop].show = false);
        }
      }
      return userTypes;
    },
    getJourneyInputs(inputs) {
      for (const property in inputs) {
        const parentInput = inputs[property];
        for (const childProp in parentInput) {
          const childInput = parentInput[childProp];
          if (childProp == "have" && !childInput) {
            this.disable_touch_mode = true;
          }
        }
      }
    },
  },
  methods: {
    ...mapActions("journey", [
      "createJourney",
      "updateJourney",
      "fetchUserTypeRelatedToJourney",
      "fetchJourneyDetails",
      "fetchJourneyInputs",
    ]),
    onJourneySubmit() {
      this.submitted = true;
      this.$v.$touch();
      const { name, description } = this.journey;
      const { userTypes, vaccine_column_name, touch_mode, name_match_mode } = this;
      if (!this.$v.$invalid) {
        let entity = store.getters["authfack/currentEntity"];
        let submittedForm = {
          journey: {
            name: name,
            entity_id: entity.id,
            description: description,
          },
          settings: { touch_mode: touch_mode ? 1 : 0, name_match_mode },
        };
        console.log('submit', name_match_mode);
        this.$route.name == "updateJourney"
          ? this.updateJourney({
              id: this.$route.params.id,
              form: {
                journey: {
                  name,
                  description,
                  entity_id: entity.id,
                },
                userTypes,
                settings: {
                  vaccine_column_name: vaccine_column_name
                    ? vaccine_column_name
                    : "Covid Vaccine",
                  touch_mode: touch_mode ? 1 : 0,
                  name_match_mode,
                },
              },
            })
          : this.createJourney(submittedForm);
      }
    },
    onUpdateTouchMode() {
      if (this.disable_touch_mode) {
        this.$bvModal.show("touchModeAlert");
      }
    },
    getDifference(array1, array2) {
      return array1.filter((object1) => {
        return !array2.some((object2) => {
          return object1.id === object2.id;
        });
      });
    },
  },
  beforeMount() {
    this.$route.name == "updateJourney" &&
      (this.fetchUserTypeRelatedToJourney(this.$route.params.id),
      this.fetchJourneyInputs(this.$route.params.id));
  },
};
</script>

<style lang="scss" scoped>
// .active {
//     background: rgb(243, 16, 0) !important;
// }
.page-title {
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #495057;
  margin-bottom: 28px;
}
.journey-form {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  .form-title {
    font-weight: 900;
    font-size: 20px;
    line-height: 24px;
    color: #939393;
    opacity: 0.46;
    margin-bottom: 33px;
  }
  .name-match {
    font-weight: Bold;
    font-size: 16px;
    color: #939393;
    /* margin-bottom: 10px; */
    margin-right: 52px;
    margin-top: 40px;
  }
  // .activeRadio {
  //   color: #103F5E
  // }
  .content {
    padding: 0;
    margin-top: 0;
    width: 422px;
    margin-bottom: 60px;
    .journey-name {
      margin-bottom: 17px;
    }
    .h-line {
      margin: 28px 0;
    }
    .user-types {
      margin-bottom: 36px;
      .text-title {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        color: #939393;
        margin-bottom: 30px;
      }
      .subtitle {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        margin-bottom: 33px;
        color: #c7c7c7;
      }
      .user-types-checks {
        display: flex;
        flex-wrap: wrap;
        .custom-checkbox {
          margin-bottom: 20px;
        }
        .text {
          margin-bottom: 0;
          font-size: 16px;
          color: #787878;
          margin-left: 15px;
          margin-right: 50px;
        }
      }
    }
    .touch-mode {
      display: flex;
      position: relative;
      .label {
        font-weight: Bold;
        font-size: 16px;
        color: #939393;
        margin-bottom: 0;
        margin-right: 52px;
      }
    }
  }
  .actions {
    display: flex;
    justify-content: center;
    margin-top: 150px;
    .submit-btn {
      margin-right: 93px;
    }
    .cancel-btn,
    .submit-btn {
      border-radius: 16.6275px;
      width: 111.69px;
      height: 33px;
      line-height: 16.5px;
    }
  }
}
.err-wrapper {
  padding-left: 20px;
}
</style>
