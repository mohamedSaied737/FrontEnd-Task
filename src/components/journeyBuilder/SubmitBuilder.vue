<template>
  <section
    class="journey-builder"
    v-if="getTypes.length == 0 && currentRoute == addJourneyFlow"
  >
    <PageHeader
      title="Journey Flow"
      className="d-flex align-items-center justify-content-between mb-2"
    >
      <div class="page-title-right mb-2 d-flex">
        <router-link to="/add-user-type">
          <b-button
            pill
            class="d-flex align-items-center px-4"
            variant="primary"
            size="md"
          >
            <i class="bx bx bx-plus font-size-18 mr-2"></i>
            <span role="link"> Create User Type </span>
          </b-button>
        </router-link>
        <router-link to="/journeys">
          <b-button
            pill
            class="d-flex align-items-center px-4 mx-3"
            variant="outline-primary"
            size="md"
          >
            <i class="bx bx bx bx-right-arrow-alt font-size-18 mr-2"></i>
            <span role="link"> Journeys list </span>
          </b-button>
        </router-link>
      </div>
    </PageHeader>
    <h4 class="mt-5 text-muted">
      There is no user types to add a new flow to this journey, Please add new a
      user type!
    </h4>
  </section>
  <section v-else class="journey-builder">
    <!-- selected journey wrapper  -->
    <div class="mb-3 d-flex justify-content-between">
      <div class="selected-journey journey-wrapper d-flex align-items-center">
        <label for="journey" class="mb-0">Journey: </label>
        <p class="text-muted mb-0 ml-2">
          {{
            currentRoute == addFlowRoute ? getSelectedJourney.name : journeyName
          }}
        </p>
      </div>
      <router-link to="/add-journey" custom v-slot="{ navigate }">
        <b-button
          @click="navigate"
          pill
          class="d-flex align-items-center px-4"
          variant="outline-primary"
          size="sm"
        >
          <i class="bx bx-plus font-size-18 mr-2"></i>
          Add New Journey
        </b-button>
      </router-link>
    </div>
    <!-- journey builder wrapper  -->
    <div class="journey-builder d-flex">
      <div class="journey-inputs-wrapper">
        <!-- journey flow wrapper  -->
        <div class="form-elements-wrapper mb-3">
          <h5 class="text-muted mt-4 mb-3">
            {{
              $route.name == "updateFlow"
                ? "Update Journey Flow"
                : "Create Journey Flow"
            }}
          </h5>
          <label for="flow_name" class="mb-1">Flow Name</label>
          <b-form-input
            id="flow_name"
            class="mb-3"
            placeholder="Flow Name"
            v-model="name"
          ></b-form-input>
          <label for="flow_description" class="mb-1">Flow Description</label>
          <b-form-textarea
            id="flow_description"
            v-model="description"
            class="form-control"
            rows="3"
            placeholder="Flow Description"
            no-resize
          ></b-form-textarea>
        </div>
        <div class="settings-wrapper mb-5">
          <!-- user types -->
          <div class="title-wrapper d-flex align-items-center mb-1">
            <label for="user_type" class="mb-0">User Type </label>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <multiselect
              id="user_type"
              v-model="userType"
              label="name"
              :options="userTypesOptions"
              placeholder="select user type.."
              trackBy="name"
              :show-labels="false"
              :hideSelected="true"
              multiple
              @remove="onRemoveUserType"
            >
              <template slot="option" slot-scope="props">
                <div class="option__desc">
                  <span
                    v-if="props.option.parent_id == null"
                    class="option__name font-weight-bold"
                    >{{ props.option.name }}</span
                  >
                  <span
                    v-else
                    class="option__usertype__child font-weight-bold ml-2"
                  >
                    - {{ props.option.name }}</span
                  >
                </div>
              </template>
            </multiselect>
            <button
              class="btn p-0 mx-2"
              :disabled="!userType || (userType && userType.length == 0)"
              @click="
                checkNodeType('User Type')
                  ? editNode('User Type', userType)
                  : addNode('User Type', userType, 0, 100)
              "
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('User Type')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
          <!-- input -->
          <label for="input" class="mb-0">Input</label>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <multiselect
              id="input"
              v-model="input"
              label="name"
              :options="InputTypes"
              placeholder="select input.."
              trackBy="name"
              :show-labels="false"
              :hideSelected="true"
              multiple
              :disabled="!userType"
            />
            <button
              class="btn p-0 mx-2"
              @click="
                checkNodeType('Input')
                  ? editNode('Input', input)
                  : addNode('Input', input, 120, 100)
              "
              :disabled="!input || (input && input.length == 0)"
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('Input')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
          <p
            class="h5 mb-2"
            style="color: DODGERBLUE; font-size: 14px"
            v-if="isWalkinUserType && isFaceRecognition && touch_mode"
          >
            <b-icon icon="info-circle"></b-icon> Face Recognition will not work
            for undefined users.
          </p>
          <!-- checks -->
          <div class="title-wrapper d-flex align-items-center mb-1">
            <label for="check" class="mb-0">Check</label>
            <i
              v-if="checkSetting"
              class="bx bx-cog ml-1 settings-icon"
              @click="openSetting('Check')"
            ></i>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <multiselect
              id="check"
              v-model="check"
              :options="checks"
              placeholder="select check.."
              :show-labels="false"
              :hideSelected="true"
              multiple
              trackBy="name"
              label="name"
              :disabled="!userType"
            />
            <button
              class="btn p-0 mx-2"
              @click="
                checkNodeType('Checks')
                  ? editNode('Checks', check)
                  : addNode('Checks', check, 240, 100)
              "
              :disabled="!check || (check && check.length == 0)"
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('Checks')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
          <!-- compliance -->
          <div class="title-wrapper d-flex align-items-center mb-1">
            <label for="compliance" class="mb-0">Compliance</label>
            <i
              v-if="compliance"
              class="bx bx-cog ml-1 settings-icon"
              v-b-modal="'complianceSettings'"
            ></i>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <multiselect
              id="compliance"
              v-model="compliance"
              :options="getComplianceList"
              placeholder="select compliance.."
              :show-labels="false"
              :hideSelected="true"
              trackBy="name"
              label="name"
              multiple
              :disabled="!userType"
            />
            <button
              class="btn p-0 mx-2"
              @click="
                checkNodeType('Compliance')
                  ? editNode('Compliance', compliance)
                  : addNode('Compliance', compliance, 360, 100)
              "
              :disabled="!compliance || (compliance && compliance.length == 0)"
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('Compliance')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
          <b-modal
            id="complianceSettings"
            hide-footer
            title="Compliance Settings"
            size="lg"
          >
            <transition-group name="fade" mode="out-in">
              <div v-for="(el, index) in complianceSettings" :key="el.id">
                <ComplianceSettingsForm
                  :element="el"
                  :index="index"
                  :deleteComplianceSetting="deleteComplianceSetting"
                />
              </div>
            </transition-group>
            <div class="d-flex justify-content-end align-items-center">
              <button
                class="btn btn-primary px-3"
                @click="$bvModal.hide('complianceSettings')"
              >
                Ok
              </button>
            </div>
          </b-modal>
          <!-- output -->
          <div class="title-wrapper d-flex align-items-center mb-1">
            <label for="output" class="mb-0">Output</label>
            <i
              v-if="outputSetting"
              class="bx bx-cog ml-1 settings-icon"
              @click="openSetting('Output')"
            ></i>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <multiselect
              id="output"
              v-model="output"
              :options="outputs"
              placeholder="select output.."
              :show-labels="false"
              :hideSelected="true"
              multiple
              trackBy="name"
              label="name"
              :disabled="!userType"
            />
            <button
              class="btn p-0 mx-2"
              @click="
                checkNodeType('Output')
                  ? editNode('Output', output)
                  : addNode('Output', output, 480, 100)
              "
              :disabled="!output || (output && output.length == 0)"
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('Output')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
          <!-- notification -->
          <div class="title-wrapper d-flex align-items-center mb-1">
            <label for="notification" class="mb-0">Notification</label>
            <i
              v-if="notificationSetting"
              class="bx bx-cog ml-1 settings-icon"
              @click="openSetting('Notification')"
            ></i>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <multiselect
              id="notification"
              v-model="notification"
              :options="notifications"
              placeholder="select notification.."
              :show-labels="false"
              :hideSelected="true"
              multiple
              trackBy="name"
              label="name"
              :disabled="!userType"
            />
            <button
              class="btn p-0 mx-2"
              @click="
                checkNodeType('Notifications')
                  ? editNode('Notifications', notification)
                  : addNode('Notifications', notification, 600, 100)
              "
              :disabled="
                !notification || (notification && notification.length == 0)
              "
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('Notifications')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
          <!-- feedback -->
          <div class="title-wrapper d-flex align-items-center mb-1">
            <label for="feedback" class="mb-0">Feedback </label>
            <i
              v-if="feedbackSetting"
              class="bx bx-cog ml-1 settings-icon"
              @click="openSetting('Feedback')"
            ></i>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <multiselect
              id="feedback"
              v-model="feedback"
              :options="feedbacks"
              placeholder="select feedback.."
              multiple
              trackBy="name"
              label="name"
              :show-labels="false"
              :hideSelected="true"
              :disabled="!userType"
            />
            <button
              class="btn p-0 mx-2"
              @click="
                checkNodeType('Feedback')
                  ? editNode('Feedback', feedback)
                  : addNode('Feedback', feedback, 720, 100)
              "
              :disabled="!feedback || (feedback && feedback.length == 0)"
            >
              <i
                class="mdi add-icon"
                :class="
                  checkNodeType('Feedback')
                    ? 'mdi-rotate-3d-variant text-success'
                    : 'mdi-plus-circle-outline'
                "
              >
              </i>
            </button>
          </div>
        </div>
      </div>
      <div id="flowchart" class="w-100">
        <div
          class="
            d-md-flex
            justify-content-between
            align-items-center
            digram-config
            p-2
          "
          style="border: 1px solid #f8f8fb"
        >
          <div class="d-flex align-items-center my-2">
            <label v-if="userType" class="mb-0 mr-3" for="scale">Scale</label>
            <b-form-input
              size="sm"
              v-if="userType"
              id="scale"
              type="number"
              min="0.1"
              step="0.1"
              v-model.number="scene.scale"
            />
          </div>
          <div>
            <button
              @click="onBuilderSubmit"
              :disabled="getLoading"
              pill
              class="submit-btn btn btn-primary px-4 no-wrap btn-sm"
              size="md"
            >
              <i
                v-if="getLoading"
                class="
                  bx bx-loader bx-spin
                  font-size-16
                  align-middle
                  mr-2
                  rounded
                "
              ></i>
              <span v-else>
                {{
                  currentRoute == "updateFlow"
                    ? "Update Journey Builder"
                    : "Save Journey Builder"
                }}
              </span>
            </button>
            <router-link to="/journeys" custom v-slot="{ navigate }">
              <button
                @click="navigate"
                class="btn btn-outline-primary px-3 ml-4 btn-sm my-2"
              >
                Cancel
              </button>
            </router-link>
          </div>
        </div>
        <light-flowchart
          class="flowchart-wrapper"
          :scene.sync="scene"
          @nodeDelete="nodeDelete"
        />
      </div>
    </div>
    <!-- settings modal   -->
    <b-modal
      id="setting_modal"
      scrollable
      size="md"
      ref="modal"
      hide-footer
      :title="`${modalTitle} Settings`"
    >
      <form ref="form">
        <div v-for="setting in getchildSettings" :key="setting.id">
          <!-- user type settings  -->
          <div v-if="setting.parent_id == 1 && modalTitle == 'Feedback'">
            <label class="user-type-setting-label" style="font-size: 0.9rem">{{
              setting.label
            }}</label>
            <b-form-textarea
              v-model="settings[setting.name]"
              placeholder="Enter text..."
              rows="1"
            ></b-form-textarea>
            <br />
          </div>
          <!-- feedback settings  -->
          <div v-if="setting.parent_id == 32 && modalTitle == 'Feedback'">
            <div class="d-flex align-items-center mb-3"></div>
          </div>
          <!-- output settings  -->
          <div
            v-if="
              (setting.parent_id == 7 ||
                setting.id == 61 ||
                setting.id == 73 ||
                setting.id == 72 ||
                setting.id == 62) &&
              modalTitle == 'Output'
            "
          >
            <div
              class="title-wrapper d-flex align-items-center mb-3"
              v-if="setting.type == 'string'"
            >
              <label
                class="mb-0 font-weight-normal no-wrap mr-3"
                style="width: 300px"
                >{{ setting.label }}</label
              >
              <multiselect
                v-model="settings[setting.name]"
                :options="optionsWeigand"
                placeholder="select .."
                multiple
                trackBy="name"
                label="name"
                :show-labels="false"
                :hideSelected="true"
              />
            </div>
            <div
              class="d-flex align-items-center mb-3"
              v-if="setting.type == 'boolean' || setting.type == 'Boolean'"
            >
              <label
                class="mb-0 font-weight-normal no-wrap mr-3"
                style="width: 180px"
                >{{ setting.label }}</label
              >
              <b-form-checkbox
                switch
                size="lg"
                v-model="settings[setting.name]"
              ></b-form-checkbox>
            </div>
          </div>
          <!-- checks settings  -->
          <div
            v-if="
              (setting.parent_id == 3 || setting.parent_id == 75) &&
              modalTitle == 'Check'
            "
          >
            <div
              class="d-flex align-items-center mb-3"
              v-if="setting.type == 'float' && isTemperature"
            >
              <label
                for="checksSetting"
                class="mb-0 font-weight-normal no-wrap input-label mr-4"
                >{{ setting.label }}</label
              >
              <input
                v-if="companyTemp == 'c'"
                id="checksSetting"
                v-model="settings[setting.name]"
                min="30"
                max="45"
                type="range"
                class="form-control-range"
                step="0.1"
                v-b-tooltip.bottom="settings[setting.name]"
              />
              <input
                v-if="companyTemp == 'f'"
                id="checksSetting"
                v-model="settings[setting.name]"
                min="90"
                max="105"
                type="range"
                class="form-control-range"
                step="0.1"
                v-b-tooltip.bottom="settings[setting.name]"
              />
            </div>
            <div
              class="d-flex align-items-center mb-3"
              v-if="setting.type == 'radio' && isTemperature"
            >
              <label
                for="checksSetting"
                class="mb-0 font-weight-normal no-wrap input-label mr-5"
                >{{ setting.label }}</label
              >
              <div class="flex-row">
                <b-form-radio
                  name="some-radios"
                  v-model="settings[setting.name]"
                  value="sampled"
                  >Sampled</b-form-radio
                >
                <b-form-radio
                  class="mx-3"
                  name="some-radios"
                  v-model="settings[setting.name]"
                  value="rapid"
                  >Rapid</b-form-radio
                >
              </div>
            </div>
            <div
              class="d-flex align-items-center mb-3"
              v-if="setting.type == 'Boolean' && isVaccine"
            >
              <label class="mb-0 font-weight-normal no-wrap mr-4">{{
                setting.label
              }}</label>
              <b-form-checkbox
                switch
                size="lg"
                v-model="settings[setting.name]"
              ></b-form-checkbox>
            </div>
          </div>
          <!-- notification settings  -->
          <div v-if="setting.parent_id == 17 && modalTitle == 'Notification'">
            <div
              class="d-flex align-items-center mb-3"
              v-if="setting.type == 'boolean' && setting.name != 'send_via_sms'"
            >
              <label class="mb-0 font-weight-normal no-wrap mr-4">{{
                setting.label
              }}</label>
              <b-form-checkbox
                switch
                size="lg"
                v-model="settings[setting.name]"
              ></b-form-checkbox>
            </div>
            <div
              class="mb-3"
              v-if="
                setting.type == 'string' && setting.name != 'send_to_email_sms'
              "
            >
              <div class="d-flex align-items-center">
                <label class="mb-0 font-weight-normal no-wrap mr-4">{{
                  setting.label
                }}</label>
                <b-form-input
                  :class="{
                    'is-invalid': $v.settings.send_to_email.$error,
                  }"
                  v-model="settings[setting.name]"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  @input="$v.settings.send_to_email.$touch()"
                  :disabled="!settings.send_via_email"
                />
              </div>
              <div class="err-wrapper">
                <div v-if="!$v.settings.send_to_email.required">
                  <span class="text-danger">Email is required.</span>
                </div>
                <div v-else-if="!$v.settings.send_to_email.multiEmail">
                  <span class="text-danger"
                    >Please enter a vaild emails format, separated by
                    comma.</span
                  >
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <template v-if="outputExist && modalTitle == 'Output'">
          <hr />
          <p class="output-spacing">Select when to apply each output:</p>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="border">Output</th>
                <th class="border text-center">Sign in</th>
                <th class="border text-center">Sign out</th>
                <th class="border text-center">Check in</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="el in output" :key="el.name">
                <template v-if="el.name !== 'Save data'">
                  <td class="bold-cell">{{ el.name }}</td>
                  <td class="text-center">
                    <b-form-checkbox
                      size="sm"
                      v-model="el.signIn"
                    ></b-form-checkbox>
                  </td>
                  <td class="text-center">
                    <b-form-checkbox
                      size="sm"
                      v-model="el.signOut"
                    ></b-form-checkbox>
                  </td>
                  <td class="text-center">
                    <b-form-checkbox
                      size="sm"
                      v-model="el.checkIn"
                    ></b-form-checkbox>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
          <p
            class="h5 my-3"
            style="color: #f46a6a; font-size: 16px; font-weight: 400"
            v-if="removeOutput"
          >
            <b-icon icon="info-circle"></b-icon>
            "{{ removeOutput }}" will be removed from the outputs added to this
            flow because you didn't select when it should be applied
          </p>
        </template>
      </form>
      <div class="d-flex justify-content-end align-items-center">
        <button class="btn btn-primary px-3" @click="onSubmitPopupSettings">
          Ok
        </button>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LightFlowchart from "vue-light-flowchart";
import Multiselect from "vue-multiselect";
import store from "@/state/store";
import ComplianceSettingsForm from "./ComplianceSettings";
import PageHeader from "@/components/page-header";
import { requiredIf } from "vuelidate/lib/validators";
import { sliceLongString } from "@/utils/mixins/sliceLongString";

export default {
  title: "Journey Builder",
  name: "SubmitBuilder",
  mixins: [sliceLongString],
  components: {
    Multiselect,
    LightFlowchart,
    ComplianceSettingsForm,
    PageHeader,
  },
  data() {
    return {
      companyTemp: "",
      isWalkinUserType: false,
      isFaceRecognition: false,
      optionsWeigand: [
        { id: "rfid", name: "RFID" },
        { id: "face_recognition", name: "Face Recognition" },
      ],
      currentRoute: null,
      addFlowRoute: "addFlow",
      addJourneyFlow: "addJourneyFlow",
      updateFlowRoute: "updateFlow",
      journeyName: null,
      journeyId: null,
      name: null,
      description: null,
      scene: {
        centerX: 900,
        centerY: 100,
        scale: 0.9,
        nodes: [],
        links: [],
        orientation: "hor",
        canChangeNodes: true,
        canChangeLinks: false,
      },
      journeyFlowSelection: null,
      journey: null,
      journeyFlow: {},
      createdArr: [],
      checkLinks: [],
      entity_id: null,
      userTypeArray: [],
      dataUserType: "",
      //setting
      modalTitle: null,
      checkSetting: false,
      isTemperature: false,
      isVaccine: false,
      feedbackSetting: false,
      outputSetting: false,
      outputExist: false,
      notificationSetting: false,
      settings: {
        show_user_type: true,
        show_temperature: true,
        show_company_name: true,
        save_scan_image: true,
        show_photo: true,
        show_name: true,
        show_date_time: true,
        check_type: "rapid",
        temperature_threshold: 37.3,
        send_via_email: 0,
        send_to_email: "",
        send_via_sms: 0,
        send_to_email_sms: "",
        granted_message: "Welcome",
        denied_message: "Please seek assistance",
        enable_weigand_output: true,
        weigand_output_settings: [{ id: "rfid", name: "RFID" }],
      },
      can_type_email: false,
      // journey settings
      selectedFlow: null,
      userType: null,
      input: null,
      output: null,
      InputTypes: [
        { id: "facial_recognition", name: "Face Recognition" },
        { id: "rfid", name: "RFID" },
        { id: "qr_code", name: "QR Code" },
      ],
      outputs: [
        {
          id: "door_relay",
          name: "Door relay",
          data: "door_relay",
          signIn: true,
          signOut: false,
          checkIn: true,
        },
        {
          id: "print_badge",
          name: "Print badge",
          data: "print_badge",
          signIn: true,
          signOut: false,
          checkIn: true,
        },
        {
          id: "save_data",
          name: "Save data",
          data: "save_data",
          signIn: true,
          signOut: false,
          checkIn: true,
        },
      ],
      removeOutput: "",
      check: null,
      checks: [
        { id: "temperature_check", name: "Temperature" },
        { id: "mask_check", name: "Mask" },
      ],
      feedback: null,
      feedbacks: [
        { id: "audio_feedback", name: "Audio" },
        { id: "temperature_feedback", name: "Temperature" },
        { id: "light_feedback", name: "Light" },
      ],
      notification: null,
      notifications: [
        { id: "temperature_alert", name: "Temperature Alert" },
        { id: "mask_alert", name: "Mask Alert" },
        { id: "compliance_alert", name: "Compliance Alert" },
      ],
      compliance: null,
      complianceToogle: "daily",
      complianceSettings: [],
      addedNodes: [],
      complianceAddedToDiagram: false,
      touch_mode: false,
      check_register_counter: 0,
      selected_register_not_required: false,
      deleted_user_type_id: [],
      default_selected_register_not_required: null,
    };
  },
  validations: {
    settings: {
      send_to_email: {
        required: requiredIf(function () {
          return !this.settings.send_via_email ||
            this.settings.send_via_email == 0
            ? false
            : true;
        }),
        multiEmail: function (value) {
          // eslint-disable-next-line no-useless-escape
          return !this.settings.send_via_email ||
            this.settings.send_via_email == 0
            ? true
            : /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/.test(
                value
              );
        },
      },
    },
  },
  watch: {
    "settings.send_via_email"(value) {
      if (!value) {
        this.settings.send_to_email = "";
      }
    },
    "scene.nodes"(nodes) {
      const nodesList = JSON.parse(JSON.stringify(nodes));
      const checkLastIndex = nodesList.length > 0 && nodesList.slice(-1)[0];
      nodesList.length > 0
        ? nodesList.map((node) => {
            // check compliance added to digram
            if (node.type == "Compliance") {
              this.complianceAddedToDiagram = true;
            }
            // check index
            let move = this.moveElementIndex;
            let elementIndex = nodesList.indexOf(node);
            switch (node.type) {
              case "User Type":
                return move(nodesList, elementIndex, 0);
              case "Input":
                return move(nodesList, elementIndex, 1);
              case "Checks":
                return move(nodesList, elementIndex, 2);
              case "Compliance":
                return move(nodesList, elementIndex, 3);
              case "Output":
                return move(nodesList, elementIndex, 4);
              case "Notifications":
                return move(
                  nodesList,
                  elementIndex,
                  checkLastIndex.type == "Feedback"
                    ? nodesList.length - 2
                    : nodesList.length + 1
                );
              case "Feedback":
                return move(nodesList, elementIndex, nodesList.length + 1);
              default:
                null;
            }
          })
        : [];
    },
    userType(userType) {
      // check if walkin user is selected
      this.isWalkinUserType = userType.find(
        (item) => !!item.is_walkin_user_type
      );

      // remove node after empty input
      const type = JSON.parse(JSON.stringify(userType));
      if (userType && userType.length != 0) {
        this.scene.nodes.length > 0 &&
          this.removeNodeAfterClearInput(type, "User Type");
        this.dataUserType = "";
        userType &&
          userType.map((type) => {
            this.dataUserType += this.userTypeArray[type.name] + ",";
            if (type.pre_registration_method == "REGISTRATION_NOT_REQUIRED") {
              this.selected_register_not_required = true;
              type.register_not_required = true;
              this.default_selected_register_not_required = type;
            }
          });
      } else {
        this.removeNodeAfterClearInput(type, "User Type");
        this.userType = null;
      }
    },
    input(input) {
      this.isFaceRecognition = input.find(
        (item) => item.name == "Face Recognition"
      );

      const inputValue = JSON.parse(JSON.stringify(input));
      this.removeNodeAfterClearInput(inputValue, "Input");
    },
    check(check) {
      console.log("check", check);
      // remove node after clear check input
      const inputValue = JSON.parse(JSON.stringify(check));
      this.removeNodeAfterClearInput(inputValue, "Checks");
      // check settings
      let flag = false;
      let isTemperature = false;
      let isVaccine = false;
      this.checkSetting = false;
      this.isTemperature = false;
      this.isVaccine = false;
      if (check) {
        for (let i = 0; i < check.length; i++) {
          if (
            check[i].name == "Temperature" ||
            check[i].name == "Vaccine Check"
          ) {
            if (check[i].name == "Temperature") {
              isTemperature = true;
            }
            if (check[i].name == "Vaccine Check") {
              isVaccine = true;
            }
            flag = true;
          }
        }
      }
      if (flag) {
        this.checkSetting = true;
      }
      if (isTemperature) {
        this.isTemperature = true;
      }
      if (isVaccine) {
        this.isVaccine = true;
      }
    },
    compliance(compliance) {
      // remove node after clear compliance input
      const inputValue = JSON.parse(JSON.stringify(compliance));
      this.removeNodeAfterClearInput(inputValue, "Compliance");
      // settings
      this.complianceSettings =
        compliance &&
        compliance.map((compliance) => {
          const { getJourneyDetails } = this;
          return {
            name: compliance.name,
            id: compliance.id,
            setting: compliance.setting ? compliance.setting : "every_time",
            type: compliance.type
              ? compliance.type
              : getJourneyDetails.journeyFlow.compliance
                  .map((item) => item.id == compliance.id && item.type)
                  .filter(Boolean)
                  .toString(),
          };
        });
    },
    output: {
      handler: function (output) {
        const removeOutput = [];
        this.removeOutput = "";
        this.outputExist = false;
        console.log("output", output);
        // remove node after clear compliance input
        const inputValue = JSON.parse(JSON.stringify(output));
        this.removeNodeAfterClearInput(inputValue, "Output");
        // settings
        let flag = false;
        this.outputSetting = false;
        if (output) {
          for (let i = 0; i < output.length; i++) {
            if (
              output[i].name == "Door relay" ||
              output[i].name == "Print badge" ||
              output[i].name == "Save data"
            ) {
              flag = true;
            }
            if (
              output[i].name == "Door relay" ||
              output[i].name == "Print badge"
            ) {
              this.outputExist = true;
            }
            if (
              output[i].name !== "Save data" &&
              !output[i].signOut &&
              !output[i].signIn &&
              !output[i].checkIn
            ) {
              removeOutput.push(output[i].name);
              this.removeOutput = removeOutput.join(", ");
            }
          }
          console.log("removeOutput", this.removeOutput);
        }
        if (flag) {
          this.outputSetting = true;
        }
      },
      deep: true,
    },
    feedback(feedback) {
      // remove node after clear compliance input
      const inputValue = JSON.parse(JSON.stringify(feedback));
      this.removeNodeAfterClearInput(inputValue, "Feedback");
      // settings
      if (feedback && feedback.length > 0) {
        this.feedbackSetting = true;
      }
    },
    notification(notification) {
      // remove node after clear compliance input
      const inputValue = JSON.parse(JSON.stringify(notification));
      this.removeNodeAfterClearInput(inputValue, "Notifications");
      // settings
      let flag = false;
      this.notificationSetting = false;
      if (notification) {
        for (let i = 0; i < notification.length; i++) {
          if (
            notification[i].name == "Temperature Alert" ||
            notification[i].name == "Mask Alert"
          ) {
            flag = true;
          }
        }
      }
      if (flag) {
        this.notificationSetting = true;
      }
    },
    getJourneyDetails(data) {
      console.log("getjj", data);
      let journeysData = JSON.parse(JSON.stringify(data));
      // fetch journey flow with types
      this.fetchJourneysFlowandTypes(journeysData.journeyFlow.journey_id);
      // update flow with data
      (this.scene.nodes = [...journeysData.journeyFlow.diagram.nodes]),
        (this.name = journeysData.journeyFlow.name);
      this.description = journeysData.journeyFlow.description;
      this.journeyId = journeysData.journeyFlow.journey_id;
      this.fetchJourneysFlowandTypes(journeysData.journeyFlow.journey_id);
      this.journeyName = journeysData.journeyFlow.journey.name;
      const journeyData = JSON.parse(JSON.stringify(this.getJourneyDetails));
      // userType
      this.complianceSettings =
        journeyData.compliance &&
        journeyData.compliance.length > 0 &&
        journeyData.compliance.map((compliance) => {
          return {
            name: compliance.name,
            id: compliance.id,
            setting: compliance.setting,
            type: journeysData.journeyFlow.compliance
              .map((item) => item.id == compliance.id && item.type)
              .filter(Boolean)
              .toString(),
          };
        });
      //  if input has single value node.type == "Input" => { name: node.label }
      journeysData.journeyFlow.diagram.nodes &&
        journeysData.journeyFlow.diagram.nodes.length > 0 &&
        journeysData.journeyFlow.diagram.nodes.map((node) => {
          let labelArr =
            node.label &&
            node.label.length > 0 &&
            node.label.split(", ").map((value) => {
              const data =
                value == "Save data"
                  ? "save_data"
                  : value == "Door relay"
                  ? "door_relay"
                  : value == "Print badge"
                  ? "print_badge"
                  : "";
              const itemFound = journeysData.journeyFlow.setting.find(
                (item) => item.name == data
              );
              if (this.$route.name == "updateFlow" && node.id == "Output")
                console.log("found", itemFound, itemFound.pivot.metadata);
              return {
                data,
                name: value,
                checkIn:
                  this.$route.name == "updateFlow" &&
                  node.id == "Output" &&
                  value !== "Save data" &&
                  itemFound &&
                  itemFound.pivot.metadata
                    ? !!JSON.parse(itemFound.pivot.metadata).loginMode.includes(
                        1
                      )
                    : this.$route.name == "updateFlow" &&
                      node.id == "Output" &&
                      value !== "Save data" &&
                      itemFound &&
                      !itemFound.pivot.metadata
                    ? true
                    : false,
                signIn:
                  this.$route.name == "updateFlow" &&
                  node.id == "Output" &&
                  value !== "Save data" &&
                  itemFound &&
                  itemFound.pivot.metadata
                    ? !!JSON.parse(itemFound.pivot.metadata).loginMode.includes(
                        3
                      )
                    : this.$route.name == "updateFlow" &&
                      node.id == "Output" &&
                      value !== "Save data" &&
                      itemFound &&
                      !itemFound.pivot.metadata
                    ? true
                    : false,
                signOut:
                  this.$route.name == "updateFlow" &&
                  node.id == "Output" &&
                  value !== "Save data" &&
                  itemFound &&
                  itemFound.pivot.metadata
                    ? !!JSON.parse(itemFound.pivot.metadata).loginMode.includes(
                        4
                      )
                    : false,
              };
            });
          // console.log("labelArr", labelArr);
          switch (node.type) {
            case "User Type":
              this.userType = journeyData.journeyFlow.userType;
              break;
            case "Input":
              this.input = labelArr;
              break;
            case "Compliance":
              this.compliance = labelArr;
              break;
            case "Checks":
              this.check = labelArr;
              break;
            case "Feedback":
              this.feedback = labelArr;
              break;
            case "Notifications":
              this.notification = labelArr;
              break;
            case "Output":
              this.output = labelArr;
              break;
            default:
              break;
          }
          this.compliance = JSON.parse(
            JSON.stringify(this.getJourneyDetails.compliance)
          );
        });
      // settings
      for (let i = 0; i < journeysData.journeyFlow.setting.length; i++) {
        if (
          journeysData.journeyFlow.setting[i].name == "temperature_threshold"
        ) {
          const tempSetting = journeysData.journeyFlow.setting[i].pivot.value;
          this.settings.temperature_threshold = tempSetting.replace("f", "");
        }
        if (
          journeysData.journeyFlow.setting[i].parent_id != "" &&
          journeysData.journeyFlow.setting[i].parent_id != 14
        ) {
          if (journeysData.journeyFlow.setting[i].id == 62) {
            this.settings.weigand_output_settings = [];
            let value = journeysData.journeyFlow.setting[i].pivot.value;
            value = value.split(",");
            for (let i = 0; i < value.length; i++) {
              if (value[i] == "rfid") {
                this.settings.weigand_output_settings.push({
                  id: "rfid",
                  name: "RFID",
                });
              }
              if (value[i] == "face_recognition") {
                this.settings.weigand_output_settings.push({
                  id: "face_recognition",
                  name: "Face Recognition",
                });
              }
            }
          } else {
            this.settings[journeysData.journeyFlow.setting[i].name] =
              journeysData.journeyFlow.setting[i].pivot.value == 1 &&
              (journeysData.journeyFlow.setting[i].type == "boolean" ||
                journeysData.journeyFlow.setting[i].type == "Boolean")
                ? true
                : journeysData.journeyFlow.setting[i].pivot.value;
          }
        }
      }
    },
    getFlowsandTypes(data) {
      if (data.jorney && data.jorney.length > 0) {
        data.jorney.map((item) => {
          item.name == "touch_mode" &&
            (this.touch_mode = item.pivot.value == "1" ? true : false);
        });
      }
    },
  },
  computed: {
    ...mapGetters("dailyLogbook", ["getUserTypes", "getInputTypes"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("journeyBuilder", [
      "getLoading",
      "getFlowsandTypes",
      "getJourneyDetails",
      "getJourneys",
    ]),
    ...mapGetters("compliance", ["getComplianceList"]),
    ...mapGetters("setting", ["getchildSettings"]),
    ...mapGetters("journey", ["getSelectedJourney", "getJourneyList"]),
    userTypesOptions() {
      let new_user_types = Array.from(
        new Set(this.getTypes.concat(this.userType))
      ).filter(Boolean);
      console.log("new_user_types", new_user_types);
      return new_user_types.length > 0
        ? new_user_types.map((type) => {
            if (
              type.is_used == 1 &&
              type.pre_registration_method != "REGISTRATION_NOT_REQUIRED"
            ) {
              type.$isDisabled = true;
            }
            if (this.deleted_user_type_id.includes(type.id)) {
              type.$isDisabled = false;
            }
            if (type.pre_registration_method == "REGISTRATION_NOT_REQUIRED") {
              if (
                !this.getFlowsandTypes
                  .enable_registration_not_required_user_type &&
                !type.register_not_required &&
                this.selected_register_not_required
              ) {
                type.$isDisabled = true;
              } else if (
                !this.getFlowsandTypes
                  .enable_registration_not_required_user_type &&
                !this.selected_register_not_required &&
                this.$route.name == "addJourneyFlow"
              ) {
                type.$isDisabled = true;
              } else if (
                !this.getFlowsandTypes
                  .enable_registration_not_required_user_type &&
                !this.selected_register_not_required &&
                this.$route.name == "updateFlow" &&
                !this.default_selected_register_not_required
              ) {
                type.$isDisabled = true;
              } else {
                new_user_types.map((item) => {
                  if (
                    item.pre_registration_method ==
                      "REGISTRATION_NOT_REQUIRED" &&
                    !this.selected_register_not_required
                  ) {
                    item.$isDisabled = false;
                  }
                  if (
                    item.pre_registration_method ==
                      "REGISTRATION_NOT_REQUIRED" &&
                    !this.selected_register_not_required &&
                    item.register_not_required
                  ) {
                    delete item["register_not_required"];
                  }
                });
              }
            }
            if (
              this.default_selected_register_not_required &&
              this.default_selected_register_not_required.id == type.id
            ) {
              type.$isDisabled = false;
            }
            return type;
          })
        : [];
    },
    watchFlowNodes() {
      const { nodes } = this.scene.diagram;
      return nodes;
    },
    getNodeType() {
      const { nodes } = this.scene;
      return nodes.length > 0 ? nodes.map((node) => node.type) : ["no type"];
    },
    checkRoute() {
      return this.currentRoute == "updateJourney" ||
        this.currentRoute == "addJourney"
        ? true
        : false;
    },
    checkMainNodes() {
      return this.userType &&
        this.userType.length > 0 &&
        ((this.input && this.input.length > 0) || this.touch_mode) &&
        this.feedback &&
        this.feedback.length > 0
        ? true
        : false;
    },
    checkFlowInfo() {
      return this.name && this.description ? true : false;
    },
    getFlows() {
      return Object.keys(this.getFlowsandTypes).length > 0
        ? this.getFlowsandTypes.jorneyFlow
        : [];
    },
    getTypes() {
      return Object.keys(this.getFlowsandTypes).length > 0
        ? this.getFlowsandTypes.userTypes
        : [];
    },
  },
  methods: {
    ...mapActions("dailyLogbook", ["fetchInputTypes", "fetchUserTypes"]),
    ...mapActions("compliance", ["fetchComplianceList"]),
    ...mapActions("setting", ["fetchChildSettings"]),
    ...mapActions("journeyBuilder", [
      "addJourney",
      "fetchJourneyDetails",
      "updateJourney",
      "fetchJourneysFlowandTypes",
    ]),
    onRemoveUserType(removedOption) {
      this.deleted_user_type_id.push(removedOption.id);
      if (
        removedOption.pre_registration_method == "REGISTRATION_NOT_REQUIRED"
      ) {
        this.selected_register_not_required = false;
      }
    },
    onSubmitPopupSettings() {
      this.$v.$touch();
      const index = [];
      for (let i = 0; i < this.output.length; i++) {
        if (
          this.output[i].name !== "Save data" &&
          !this.output[i].signOut &&
          !this.output[i].signIn &&
          !this.output[i].checkIn
        ) {
          index.push(i);
        }
      }
      for (let i = index.length - 1; i >= 0; i--) {
        this.output.splice(index[i], 1);
      }
      this.$bvModal.hide("setting_modal");
    },
    //setting
    openSetting(title) {
      console.log("opensett");
      this.modalTitle = title;
      this.$bvModal.show("setting_modal");
      // console.log('open', this.output, this.modalTitle);
      if (this.output)
        for (let i = 0; i < this.output.length; i++) {
          if (this.$route.name != "updateFlow") {
            // add flow
            if (
              this.output[i].name !== "Save data" &&
              !this.output[i].signOut &&
              !this.output[i].signIn &&
              !this.output[i].checkIn
            ) {
              this.output[i].signOut = false;
              this.output[i].signIn = true;
              this.output[i].checkIn = true;
            }
          }
        }
    },
    // onSubmit
    onBuilderSubmit() {
      this.$v.$touch();
      if (!this.$v.settings.send_to_email.$error) {
        if (this.settings.weigand_output_settings.length > 0) {
          let value = "";
          for (
            let i = 0;
            i < this.settings.weigand_output_settings.length;
            i++
          ) {
            if (this.settings.weigand_output_settings[i].id) {
              value += this.settings.weigand_output_settings[i].id + ",";
            }
          }
          this.settings.weigand_output_settings = value;
        } else {
          this.settings.weigand_output_settings = "rfid";
        }
        this.settings.card_feedback = true;
        this.settings.message_feedback = true;
        const { nodes, links } = this.scene;
        this.journeyFlow.jourenyFlowData = {
          name: this.name,
          description: this.description,
          journey_id:
            this.currentRoute == this.addFlowRoute
              ? this.getSelectedJourney.id
              : this.journeyId,
        };
        this.journeyFlow.jourenyFlowSetting = {
          nodes: nodes,
          links: links,
          settings: this.settings,
          metadata: {},
          compliance: this.complianceSettings ? this.complianceSettings : [],
        };
        console.log("outputssubmit", this.output);
        for (let i = 0; i < this.output.length; i++) {
          if (this.output[i].name !== "Save data") {
            const loginMode = [];
            if (this.output[i].signIn) loginMode.push(3);
            if (this.output[i].signOut) loginMode.push(4);
            if (this.output[i].checkIn) loginMode.push(1);
            this.journeyFlow.jourenyFlowSetting.metadata[this.output[i].data] =
              { loginMode };
          }
        }
        console.log("metadata", this.journeyFlow.jourenyFlowSetting.metadata);
        // validation
        nodes.length == 0
          ? this.$toast.error(
              "You should add the required nodes on right side",
              {
                position: "top-right",
              }
            )
          : !this.checkMainNodes
          ? this.$toast.error(
              `Journey should have User type${
                this.touch_mode ? "" : ", input"
              } and feedback nodes!`,
              {
                position: "top-right",
              }
            )
          : !this.checkFlowInfo
          ? this.$toast.error(
              "Please enter journey flow name and description!",
              {
                position: "top-right",
              }
            )
          : this.$route.name == "updateFlow"
          ? (this.updateJourney({
              id: this.getJourneyDetails.journeyFlow.id,
              params: { journeyFlow: this.journeyFlow },
              journey_id: this.journeyId,
            }),
            (this.deleted_user_type_id = []))
          : this.addJourney({
              journeyFlow: this.journeyFlow,
              journey_id: this.journeyId,
            });

        console.log("this.journeyFlow", this.journeyFlow);
      } else {
        if (!this.$v.settings.send_to_email.required) {
          this.$toast.error(
            "Your email on notifications settings is required.",
            {
              position: "top-right",
            }
          );
        } else if (!this.$v.settings.send_to_email.email) {
          this.$toast.error(
            "Your email on notifications settings is not valid, please enter a valid email",
            {
              position: "top-right",
            }
          );
        }
      }
    },
    // links
    addDynamicLinks(nodes) {
      let nodesList = JSON.parse(JSON.stringify(nodes));
      let nodesValue =
        nodesList.length > 0 &&
        nodesList.slice(nodesList.length - 2, nodesList.length);
      if (nodesValue.length > 1) {
        this.scene.links.push({ nodes: [nodesValue[0].id, nodesValue[1].id] });
      }
    },
    moveElementIndex(arr, fromIndex, toIndex) {
      let element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    },
    getIndexOfArr(arr, element) {
      arr.indexOf(element);
    },
    // nodes
    nodeObject(type, label, y, x) {
      return {
        id: type,
        x: -700 + (x ? x : 0),
        y: -80 + (y ? y : 0),
        type: type,
        data: this.checkArray(label)
          ? label.map((value) => value.id).join(",")
          : label.id,
        label: this.checkArray(label)
          ? label.map((value) => value.name).join(", ")
          : label.name,
      };
    },
    addNode(type, label, y, x) {
      Math.max(
        0,
        ...this.scene.nodes
          .filter((link) => Number.isFinite(link.id))
          .map((link) => link.id)
      );

      switch (type) {
        case "User Type":
          return this.scene.nodes.splice(
            0,
            0,
            this.nodeObject(type, label, y, x)
          );
        // return ""
        case "Input":
          return this.scene.nodes.splice(
            1,
            0,
            this.nodeObject(type, label, y, x)
          );
        case "Checks":
          return this.scene.nodes.splice(
            2,
            0,
            this.nodeObject(type, label, y, x)
          );
        case "Compliance":
          return this.scene.nodes.splice(
            3,
            0,
            this.nodeObject(type, label, y, x)
          );
        case "Output":
          return this.scene.nodes.splice(
            4,
            0,
            this.nodeObject(type, label, y, x)
          );
        case "Notifications":
          return this.scene.nodes.splice(
            5,
            0,
            this.nodeObject(type, label, y, x)
          );
        case "Feedback":
          return this.scene.nodes.push(this.nodeObject(type, label, y, x));
        default:
          null;
      }
    },
    editNode(type, label) {
      const { nodes } = this.scene;
      let objIndex = nodes.findIndex((obj) => obj.type == type); // get index
      let idsArr = this.checkArray(label) // we get journey inputs with ids to assign them to key data
        ? this.getJourneyInputData(nodes[objIndex].type).map((item) =>
            label.map((label) => label.name == item.name && item.id)
          )
        : label.id; // get update label id
      let labelIds = idsArr
        .map((ids) => [...new Set(ids)].filter(Boolean))
        .filter(function (el) {
          return (el != el.length) != 0;
        }); // remove duplicated values
      this.currentRoute == this.addFlowRoute
        ? (nodes[objIndex].data = this.checkArray(label)
            ? label.map((value) => value.id).join(",")
            : label.id)
        : (nodes[objIndex].data = labelIds.join(",")); // set data
      nodes[objIndex].label = this.checkArray(label) // set label
        ? label.map((value) => value.name).join(", ")
        : label.name;
    },
    getJourneyInputData(inputType) {
      switch (inputType) {
        case "User Type":
          return this.getTypes;
        case "Input":
          return this.InputTypes;
        case "Checks":
          return this.checks;
        case "Output":
          return this.outputs;
        case "Notifications":
          return this.notifications;
        case "Feedback":
          return this.feedbacks;
        case "Compliance":
          return this.complianceSettings;
        default:
          [];
      }
    },
    removeNodeAfterClearInput(input, type) {
      if (input == null || (input && input.length == 0)) {
        this.scene.nodes.map((item) => {
          item.type == type &&
            this.removeParticularItem(this.scene.nodes, item);
          this.scene.links.map((link) => {
            (link.nodes[0] == type || link.nodes[1] == type) &&
              this.removeParticularItem(this.scene.links, link);
          });
        });
      }
      if (type == "Compliance") {
        this.complianceAddedToDiagram = false;
      }
    },
    removeParticularItem(arr, value) {
      let itemIndex = arr.indexOf(value);
      arr.splice(itemIndex, 1);
    },
    getArraysIntersection(arr, arr2) {
      return arr.filter((n) => {
        return arr2.indexOf(n) !== -1;
      });
    },
    clearFlowInputs() {
      this.input = null;
      this.check = null;
      this.compliance = null;
      this.output = null;
      this.feedback = null;
      this.notification = null;
    },
    nodeDelete(id) {
      switch (id) {
        case "User Type":
          this.userType = null;
          break;
        case "Input":
          this.input = null;
          break;
        case "Checks":
          this.check = null;
          break;
        case "Compliance":
          this.complianceAddedToDiagram = false;
          this.compliance = null;
          break;
        case "Output":
          this.output = null;
          break;
        case "Feedback":
          this.feedback = null;
          break;
        case "Notifications":
          this.notification = null;
          break;
        default:
          break;
      }
      // this.userType && this.addDynamicLinks(this.scene.nodes);
    },
    checkArray(arr) {
      return Array.isArray(arr);
    },
    checkNodeType(type) {
      return this.getNodeType.includes(type) ? true : false;
    },
    deleteComplianceSetting(index) {
      this.compliance.splice(index, 1);
      this.complianceSettings.splice(index, 1);
    },
    setJourneyId(route) {
      if (route == this.addFlowRoute) {
        this.journeyId = this.getSelectedJourney.id;
      }
      if (route == this.addJourneyFlow) {
        this.getJourneys.map((journey) => {
          if (journey.id == this.$route.params.id) {
            this.journeyName = journey.name;
            this.journeyId = journey.id;
          }
        });
      }
    },
  },
  beforeMount() {
    console.log("getchildSettings", this.getchildSettings);
    this.setJourneyId(this.$route.name);
    this.currentRoute = this.$route.name;
    (this.currentRoute == this.addFlowRoute ||
      this.currentRoute == this.addJourneyFlow) &&
      this.fetchJourneysFlowandTypes(this.journeyId);
    this.$route.name == "updateFlow"
      ? this.fetchJourneyDetails(this.$route.params.id)
      : this.fetchComplianceList();
    this.fetchChildSettings();
    // this.fetchUserTypes();
    this.getUserTypes.length > 0 &&
      this.getUserTypes.map((type) => {
        this.userTypeArray[type.name] = type.id;
      });
  },
  mounted() {
    localStorage.removeItem("firstSelectedRegisterType");
    this.entity_id = this.currentEntity.id;

    let entity = store.getters["authfack/currentEntity"];
    console.log("mounted", entity.setting);
    this.companyTemp =
      Object.keys(entity).length > 0 &&
      entity.setting &&
      entity.setting.length > 0 &&
      entity.setting[0].pivot
        ? entity.setting[0].pivot.value
        : "c";
  },
};
</script>

<style lang="scss">
p.output-spacing {
  margin-top: 30px;
  margin-bottom: 30px;
  font-weight: 700;
}
td.bold-cell {
  font-weight: 900;
}
.journey-builder {
  background-color: #fff;
  .journey-wrapper {
    font-size: 1.1rem;
  }
  .compliance-checks {
    border: 1px solid #ccc;
  }
  .settings-icon {
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.5s;
    color: #818794;
    outline: none;
    &:hover {
      color: #1971c2;
    }
  }
  .add-icon {
    font-size: 1.8rem;
    color: #103f5e;
    transition: 0.5s;
    &:hover {
      color: #1971c2;
    }
  }
  .dropdown-divider {
    border-top-color: #dddbda;
    margin: 1% 0;
  }
  .journey-select-wrapper {
    width: 70%;
  }
  .journey-inputs-wrapper {
    width: 400px;
    margin-right: 2%;
  }
  // diagram style
  #flowchart {
    position: relative;
    bottom: -30px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    .flowchart-wrapper {
      background-color: #f8f8fb;
      height: 86.5% !important;
      // .journey-builder .flowchart .flowchart-wrapper svg{
      // min-height: 400px!important;
      // }
    }
    .flowchart-node {
      box-shadow: 0 0 0 2px #dddbda;
      width: 150px !important;
      height: 100px !important;
    }
    .node-type {
      background-color: #fafaf9;
      color: #000;
      border-bottom: 1px solid #dddbda;
    }
    .node-label {
      padding: 0px 10px;
      color: #000;
      text-align: left;
      font-size: 0.7rem;
      font-weight: bold;
      border-color: black;
      margin-top: 5px;
      max-height: 50px;
      overflow: hidden;
    }
    .node-port {
      display: none;
    }
    .node-delete {
      line-height: 15px;
      width: 15px;
      height: 15px;
      color: #103f5e;
      background: #fff;
      border: 1px solid #103f5e;
      &:hover {
        color: #fff;
        background: #103f5e;
      }
    }
  }
}
</style>
