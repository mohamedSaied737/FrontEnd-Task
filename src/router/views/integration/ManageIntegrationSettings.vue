<template>
  <Layout>
    <!-- header -->
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <section class="wrapper">
      <div class="content">
        <b-form id="form" novalidate @submit.prevent="onSubmit">
          <div class="input-wrapper" style="width: 442px">
            <div
              class="form-group m-d-gruop"
              :class="{ 'invalid-field': submitted && form.name && getErrMsg }"
            >
              <b-form-input
                id="integrationName"
                name="integration-name"
                type="text"
                v-model="form.name"
                required
              />
              <label for="integrationName" class="intName"
              :class="{'itnName-type':!!form.name}"
                >Integration Name</label
              >
            </div>
            <div class="err-wrapper mb-2">
              <div class="text-danger" v-if="submitted && !$v.form.name.error">
                <span
                  class="font-weight-bolder"
                  v-if="submitted && !$v.form.name.required"
                  >Integration Name is required.</span
                >
                <span
                  class="font-weight-bolder"
                  v-if="submitted && !$v.form.name.maxLength"
                  >The maximum length is 30 characters.</span
                >

                <span
                  class="font-weight-bolder"
                  v-if="submitted && form.name && getErrMsg"
                  >{{ getErrMsg }}</span
                >
              </div>
            </div>
          </div>
          <div class="int-dropDown">
            <multiselect
              class="custom-tag"
              :class="{ isActive: selectedSite.length > 0 }"
              id="site"
              v-model="selectedSite"
              :options="sitesOptions"
              track-by="id"
              placeholder="Select a site"
              :show-labels="false"
              label="name"
              :allowEmpty="true"
              multiple
            >
            </multiselect>
            <div
              class="text-danger"
              style="margin-top: 12px !important"
              v-if="submitted && selectedSite.length == 0"
            >
              <span class="font-weight-bolder second"
                >one site at least should be selected</span
              >
            </div>
          </div>

          <hr class="h-line" style="margin-top: 50px; margin-bottom: 42px" />
          <div>
            <h5 class="mb-3 dark-grey" style="margin: 0 0 10px 0">
              Directory Sync Settings
            </h5>
            <h5 class="mb-4 light-grey" style="margin-bottom: 37px">
              Auto sync every:
            </h5>
          </div>
          <div class="flex-row mb-5">
            <b-form-group
              class="custom-radios custom-activeRadio space"
              style="margin: 0 50px 0 0"
              v-slot="{ ariaDescribedby }"
            >
              <b-form-radio-group
                v-model="syncValue"
                id="radio-group-1"
                :options="data.sync_settings"
                :aria-describedby="ariaDescribedby"
                name="radio-options"
              ></b-form-radio-group>
            </b-form-group>
          </div>
          <div>
            <h5 class="mb-3 dark-grey" style="margin: 0 0 10px 0">
              Deletion Handling
            </h5>
            <h5 class="mb-4 light-grey" style="margin-bottom: 37px">
              If user is deleted from the directory, then:
            </h5>
          </div>
          <div class="flex-row mb-5">
            <b-form-group
              class="custom-radios custom-activeRadio space second"
              v-slot="{ ariaDescribedbyTwo }"
            >
              <b-form-radio-group
                v-model="deletionValue"
                id="radio-group-2"
                :options="data.delete_handling"
                :aria-describedby="ariaDescribedbyTwo"
                name="radio-optionsTwo"
              ></b-form-radio-group>
            </b-form-group>
          </div>
          <hr class="h-line" style="margin-top: 50px; margin-bottom: 42px" />

          <div>
            <h5 class="dark-grey" style="margin-bottom:47px">Mapping</h5>
            <p
              class="note"
              v-if="
                getIsEdit &&
                (getUsersWithDuplicatesCount > 0 || getUsersWithErrsCount > 0)
              "
            >
              <b>Note:</b> Sorry, remapping fields or
              groups is not allowed until all the errors and duplicates have
              been fixed. Go to the
              <router-link
                :to="`/view-integration/${getIntegId}/${getIntgData.name}`"
              >
                <a> Integration Page</a>
              </router-link>
              to check
            </p>
          </div>
          <b-row class="mb-4">
            <b-col cols="5">
              <h4 class="upper-case">azure ad Directory</h4>
            </b-col>
            <b-col cols="2" class="d-flex flex-column"
              ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.5095 6.05082e-07H7.49051C6.17556 -0.000528074 4.88366 0.345394 3.74474 1.00273C2.60581 1.6602 1.6602 2.60582 1.00273 3.74474C0.34543 4.88366 -0.000495637 6.17556 6.05082e-07 7.49051V16.5095C-0.000528074 17.8244 0.345394 19.1163 1.00273 20.2553C1.6602 21.3942 2.60581 22.3398 3.74474 22.9973C4.88366 23.6546 6.17556 24.0005 7.49051 24H16.5095C17.8244 24.0005 19.1163 23.6546 20.2553 22.9973C21.3942 22.3398 22.3398 21.3942 22.9973 20.2553C23.6546 19.1163 24.0005 17.8244 24 16.5095V7.49051C24.0005 6.17556 23.6546 4.88366 22.9973 3.74474C22.3398 2.60582 21.3942 1.6602 20.2553 1.00273C19.1163 0.345431 17.8244 -0.000495637 16.5095 6.05082e-07ZM17.899 13.0534L13.3516 17.6008C12.9906 17.9619 12.4643 18.1029 11.9711 17.9707C11.478 17.8385 11.0928 17.4533 10.9606 16.9601C10.8285 16.467 10.9695 15.9408 11.3305 15.5797L13.5158 13.4147H7.10891C6.59981 13.4147 6.12946 13.1431 5.87484 12.7022C5.62038 12.2615 5.62038 11.7183 5.87484 11.2774C6.12948 10.8365 6.59981 10.565 7.10891 10.565H13.4852L11.3353 8.41258C10.9742 8.0515 10.8332 7.5253 10.9654 7.03222C11.0975 6.53895 11.4828 6.15373 11.9758 6.0216C12.4691 5.88943 12.9953 6.03041 13.3562 6.39149L17.9036 10.9389C18.1834 11.2192 18.3327 11.6041 18.3154 11.9999V12.0454C18.3163 12.4236 18.1661 12.7862 17.8986 13.0534L17.899 13.0534Z" fill="black"/>
</svg>

            </b-col>
            <b-col cols="5">
              <h4 class="upper-case">Visipoint Directory</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="5"><h6 class="dark-grey">User Fields</h6></b-col>
            <b-col cols="2"></b-col>
            <b-col cols="5"><h6 class="dark-grey">User Fields</h6></b-col>
          </b-row>
          <div
            v-for="field in textFields"
            :key="field.id"
            class="d-flex justify-content-between mb-3 mapping-fields"
          >
            <b-input-group class="width-40">
              <label  v-b-tooltip.hover v-bind:title="field.display_Name" :class="{ 'disable-field': getUsersWithDuplicatesCount > 0 || getUsersWithErrsCount > 0 }">
                {{ field.display_Name }}
              </label>
              <b-form-input
                class="width-40"
                :value="field.example_data"
                readonly
                :class="{
                  'disable-field':
                    getUsersWithDuplicatesCount > 0 ||
                    getUsersWithErrsCount > 0
                }"
              />
            </b-input-group>

            <!-- <Dropdown
              :selectedValues="dropdownValues"
              :items="dropdownItems"
              @change="dropdownChangeHanlder(field.id, $event)"
            /> -->
            <b-form-select
              @change="dropdownChangeHanlder(field.id, $event)"
              v-model="field.bindValue"
              style="padding-left: 20px"
              class="width-40 height-55 mapping-select"
              :class="{
                'disable-field':
                  getUsersWithDuplicatesCount > 0 || getUsersWithErrsCount > 0,
              }"
              :disabled="
                getIsEdit &&
                (getUsersWithDuplicatesCount > 0 || getUsersWithErrsCount > 0)
              "
            >
              <template v-for="item in dropdownItems">
                <b-form-select-option
                  :key="item.id"
                  :value="item.id"
                  :disabled="dropdownValues.includes(item.id)"
                  >{{ item.display_Name }}</b-form-select-option
                >
              </template>
            </b-form-select>
          </div>
          <div
            class="text-danger"
            v-if="submitted && !$v.form.dirMapValuesArray.required"
          >
            <span class="font-weight-bolder"
              >one field at least should be selected</span
            >
          </div>
          <hr class="h-line" style="margin-top: 50px; margin-bottom: 42px" />
          <div style="margin:auto;width:100%;text-align:center">
            <p class="note-center" v-if="!getIsEdit">
              <b>Note:</b> Ignored groups won’t be available after the first sync is
              completed successfully.
            </p>
          </div>

          <b-row>
            <b-col cols="5"><h6 class="dark-grey">Groups</h6></b-col>
            <b-col cols="2"></b-col>
            <b-col cols="5"><h6 class="dark-grey">User Types</h6></b-col>
          </b-row>
          <div
            v-for="group in groupTextFields"
            :key="group.id"
            class="d-flex justify-content-between mb-3 mapping-fields"
          >
            <b-form-input
              class="width-40"
              :value="group.name"
              
              readonly
              :class="{
                'disable-field':
                  getUsersWithDuplicatesCount > 0 || getUsersWithErrsCount > 0,
              }"
            />
            <!-- <RoleDropdown
              :roles="rolesItems"
              :selected="getSelectedGroups(group.id)"
              @change="groupChangeHanlder(group.id, $event)"
            /> -->
            <b-input-group>
              <b-form-select
                @change="groupChangeHanlder(group.id, $event)"
                class="width-40 height-55 mapping-select"
                style="padding-left: 20px"
                v-model="group.bindValue"
                :class="{
                  'disable-field':
                    getUsersWithDuplicatesCount > 0 ||
                    getUsersWithErrsCount > 0,
                }"
                :disabled="
                  getIsEdit &&
                  (getUsersWithDuplicatesCount > 0 || getUsersWithErrsCount > 0)
                "
              >
                <template v-for="role in rolesItems">
                  <b-form-select-option :key="role.id" :value="role">
                    {{ role.name }}
                  </b-form-select-option>
                </template>
              </b-form-select>
            </b-input-group>
          </div>
          <div
            class="text-danger"
            v-if="submitted && !$v.form.rolesItemsArray.required"
          >
            <span class="font-weight-bolder"
              >one group role at least should be selected</span
            >
          </div>
          <div
            class="action-btns d-flex justify-content-center"
            style="margin-top: 118px; margin-bottom: 100px !important"
          >
            <button
              class="submit-btn btn btn-primary"
              size="md"
              type="submit"
              :disabled="getLoading || $v.$invalid || selectedSite.length == 0"
              v-if="!getIsEdit"
              @click="saveAndSync = false"
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
              <span>Import</span>
            </button>

            <div
              v-if="
                getIsEdit && getIntgData && getIntgData.status !== 'Expired'
              "
            >
              <button
                class="submit-btn btn btn-primary"
                size="md"
                type="submit"
                :disabled="getLoading || $v.$invalid"
                @click="saveAndSync = false"
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
                <span>Save</span>
              </button>

              <button
                class="submit-btn btn btn-primary"
                :class="{ 'custom-loader': true }"
                size="md"
                type="submit"
                :disabled="getLoading || $v.$invalid"
                @click="saveAndSync = false"
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
                <span>Save & Sync</span>
              </button>
            </div>
          </div>
        </b-form>
      </div>
    </section>

    <!-- warning  -->
    <b-modal
      id="mappingChangedWarning"
      class="popover-modal"
      hide-header
      hide-footer
      no-close-on-esc
      ref="mappingChangedWarning"
    >
      <slot name="modal-header">
        <div class="modalHeader">
          <h4 class="modal-title">
            <slot name="modal-title"> Warning </slot>
          </h4>
        </div>
      </slot>
      <div class="d-block text-center modal-cusomContent">
        <p class="modal-paragraph">
          By changing your mapped fields or groups, your previously solved
          errors or duplicates will be dismissed and all the data will be
          imported again.
        </p>
        <p class="modal-smallParagraph">
          By pressing<span class="bold-word"> “Cancel” </span>all you
          integration settings will be reversed.
        </p>
      </div>
      <div class="line"></div>
      <div class="action-btns">
        <b-button
          variant="primary"
          type="button"
          pill
          :disabled="getLoading"
          style="margin-right: 31px !important"
          class="text-center modal-buttonSize"
          @click="repeatImport()"
        >
          Import
        </b-button>

        <b-button
          variant="outline-danger"
          type="button"
          pill
          :disabled="getLoading"
          class="text-center modal-buttonSize"
          @click="resetFormWithIntgData()"
        >
          Cancel
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>
<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// import Dropdown from "@/components/integration/DirFieldsDropdown";
// import RoleDropdown from "@/components/integration/RolesDropdown";
import Multiselect from "vue-multiselect";
import { mapGetters, mapActions } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";

const filterObject = (obj, filter, filterValue) =>
  Object.keys(obj).reduce(
    (acc, val) =>
      obj[val][filter] === filterValue
        ? acc
        : {
            ...acc,
            [val]: obj[val],
          },
    {}
  );

export default {
  title: "Integration Settings",
  components: {
    Layout,
    PageHeader,
    // Dropdown,
    // RoleDropdown,
    Multiselect,
  },
  data() {
    return {
      selected: null,
      submitted: false,
      saveAndSync: false,
      syncValue: "Daily",
      deletionValue: "Delete",
      title: "Integration Settings",
      sitesOptions: [],
      selectedSite: [],
      value: [],
      data: {},
      textFields: [],
      dropdownItems: [{ id: null, display_Name: "Select User Field" }],
      dirMapValues: {},
      originalDirMapValues: {},
      rolesValues: {},
      originalRolesValues: {},
      groupTextFields: [],
      rolesItems: [{ id: null, name: "Select User Type" }],
      formData: {},
      sites: [],
      values: {},
      form: {
        name: "",
        // selectedSite: [],
        dirMapValuesArray: [],
        rolesItemsArray: [],
      },
    };
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(30),
      },
      // selectedSite: {
      //   required,
      // },
      dirMapValuesArray: {
        required,
      },
      rolesItemsArray: {
        required,
      },
    },
  },
  watch: {
    form(form) {
      console.log("forn", form);
    },
    getErrMsg(getErrMsg) {
      console.log("getErrMsg", getErrMsg);
    },
  },
  methods: {
    ...mapActions("integration", [
      "manageIntegrationSettings",
      "editIntegrationSettings",
      "updateIntegrationSettingsAndSync",
      "createConfigData",
      // "getIntegration", // should be removed
    ]),
    // getSelected(dir_field_id) {
    //   console.log("gg", dir_field_id);
    //   const mapFound = this.getIntgDataCopy.fields_mappings.find(
    //     (item) => item.dir_field_id == dir_field_id
    //   );
    //   if (mapFound) return mapFound.cloud_field_id;
    //   return this.dirMapValues[dir_field_id]
    //     ? this.dirMapValues[dir_field_id]
    //     : null;
    // },
    // getSelectedGroups(dir_group_id) {
    //   console.log("getSelectedGroups", dir_group_id);
    //   const mapFound = this.getIntgDataCopy.groups_mappings.find(
    //     (item) => item.dir_group_id == dir_group_id
    //   );
    //   console.log("mapFound", mapFound);
    //   if (mapFound)
    //     return { id: mapFound.cloud_role_id, name: mapFound.dir_group_name };
    //   return { id: null, name: "Select User Type" };
    // },
    siteChanged() {
      console.log("sitech");
    },
    onSubmit() {
      (this.submitted = true), this.$v.$touch();
      if (!this.$v.$invalid) {
        this.submitForm();
      }
    },
    dropdownChangeHanlder(inputId, dropdownId) {
      // console.log("handler", inputId, dropdownId);
      this.dirMapValues = {
        ...this.dirMapValues,
        [inputId]: {
          dir_field_id: inputId,
          cloud_field_id: dropdownId,
        },
      };
      this.dirMapValues = filterObject(
        this.dirMapValues,
        "cloud_field_id",
        null
      );
      this.form.dirMapValuesArray = Object.values(this.dirMapValues);
      this.form.dirMapValuesArray = this.form.dirMapValuesArray.filter(
        (item) => !!item.cloud_field_id
      );
    },

    groupChangeHanlder(inputId, role) {
      // const roleName = this.rolesItems.find((item) => item.id == roleId);
      this.rolesValues = {
        ...this.rolesValues,
        [inputId]: {
          cloud_role_id: role.id,
          dir_group_id: inputId,
          dir_group_name: role.name,
        },
      };
      this.rolesValues = filterObject(this.rolesValues, "cloud_role_id", null);
      this.form.rolesItemsArray = Object.values(this.rolesValues);
      this.form.rolesItemsArray = this.form.rolesItemsArray.filter(
        (item) => !!item.cloud_role_id
      );
    },

    repeatImport() {
      this.formData.is_mapping_change = 1;
      // console.log('repeat', this.formData);
      // edit and import again
      this.editIntegrationSettings({
        data: this.formData,
        isEdit: this.getIsEdit,
      });
    },

    submitForm() {
      this.sites = this.selectedSite.map((item) => {
        return {
          site_id: item.id,
        };
      });
      console.log(this.getModalInfo, this.getIntgData);
      this.formData = {
        dir_unique_id: this.data.dir_unique_id,
        id: this.getIntegId,
        is_mapping_change: 0,
        dir_id:
          this.getIntgData && this.getIntgData.dir_id
            ? this.getIntgData.dir_id
            : this.getModalInfo.id,
        dir_code:
          this.getIntgData && this.getIntgData.dir_code
            ? this.getIntgData.dir_code
            : this.getModalInfo.code,
        entity_id: this.currentEntity.id,
        name: this.form.name,
        configs: this.getConfigData,
        sites: this.sites,
        sync_setting: {
          sync_time: this.syncValue,
        },
        delete_user_setting: {
          delete_handle: this.deletionValue,
        },
        fields_mappings: this.form.dirMapValuesArray,
        groups_mappings: this.form.rolesItemsArray,
      };
      console.log("formData", this.formData);
      if (
        this.getIntegId &&
        (JSON.stringify(this.originalRolesValues) !==
          JSON.stringify(this.rolesValues) ||
          JSON.stringify(this.originalDirMapValues) !==
            JSON.stringify(this.dirMapValues))
      ) {
        console.log("mapping changed");
        this.$bvModal.show("mappingChangedWarning");
        return;
      } else if (this.getIntegId) {
        // edit and redirect to errors / duplicate / valid users
        if (!this.saveAndSync)
          this.editIntegrationSettings({
            data: this.formData,
            isEdit: this.getIsEdit,
          });
        else {
          console.log("saveAndSync");
          this.updateIntegrationSettingsAndSync({
            data: this.formData,
            isEdit: this.getIsEdit,
          });
        }
      } else {
        // create new integration
        this.manageIntegrationSettings(this.formData);
      }
    },

    resetFormWithIntgData() {
      this.$bvModal.hide("mappingChangedWarning");
      this.originalDirMapValues = {};
      this.dirMapValues = {};
      this.originalDirMapValues = {};
      this.rolesValues = {};
      this.dropdownItems = [{ id: null, display_Name: "Select User Field" }];
      this.groupTextFields = [];
      this.textFields = [];
      this.rolesItems = [{ id: null, name: "Select User Type" }];
      this.data = this.getCreatedIntegration;
      this.sitesOptions = this.data.sites;
      console.log("data", this.data);

      // mapping fields configuration
      if (this.data.fields_mapping) {
        const fieldsMappingArray = this.data.fields_mapping;
        fieldsMappingArray.forEach((item) => {
          if (item.type === "system") {
            this.dropdownItems.push(item);
          } else {
            const mapFound = this.getIntegId
              ? this.getIntgData.fields_mappings.find(
                  (dropdownItem) => dropdownItem.dir_field_id == item.id
                )
              : null;
            this.textFields.push({
              ...item,
              bindValue: mapFound ? mapFound.cloud_field_id : null,
            });
          }
        });
      }

      // mapping groups configuration
      if (this.data.roles) {
        this.data.roles.map((item) => {
          this.rolesItems.push({ id: item.id, name: item.name });
        });
      }
      if (this.data.groups) {
        this.data.groups.forEach((item) => {
          const mapFound = this.getIntegId
            ? this.getIntgData.groups_mappings.find(
                (dropdownItem) => dropdownItem.dir_group_id == item.id
              )
            : null;
          this.groupTextFields.push({
            id: item.id,
            name: item.name,
            bindValue: mapFound
              ? { id: mapFound.cloud_role_id, name: mapFound.dir_group_name }
              : { id: null, name: "Select User Type" },
          });
        });
      }

      // is Edit
      if (this.getIntegId) {
        this.getIntgData.groups_mappings.forEach((item) => {
          this.originalRolesValues = {
            ...this.originalRolesValues,
            [item.dir_group_id]: {
              cloud_role_id: item.cloud_role_id,
              dir_group_id: item.dir_group_id,
              dir_group_name: item.dir_group_name,
            },
          };
        });
        this.getIntgData.fields_mappings.forEach((item) => {
          this.originalDirMapValues = {
            ...this.originalDirMapValues,
            [item.dir_field_id]: {
              dir_field_id: item.dir_field_id,
              cloud_field_id: item.cloud_field_id,
            },
          };
        });

        // console.log(this.getIntgData);
        this.syncValue = this.getIntgData.sync_setting.sync_time;
        this.deletionValue = this.getIntgData.delete_user_setting.delete_handle;

        this.form = {
          name: this.getIntgData.name,
          // selectedSite: [],
          dirMapValuesArray: [],
          rolesItemsArray: [],
        };
        this.selectedSite = this.getIntgData.sites.map((item) => {
          return {
            // created_at: item.created_at,
            // deleted_at: item.deleted_at,
            // dir_integrations: item.dir_integrations,
            // entity_id: item.entity_id,
            id: item.id,
            // is_default: item.is_default,
            // logo: item.logo,
            // metadata: item.metadata,
            name: item.name,
            // reception_email: item.reception_email,
            // timezone: item.timezone,
            // updated_at: item.updated_at,
          };
        });

        this.getIntgData.groups_mappings.forEach((item) => {
          this.rolesValues = {
            ...this.rolesValues,
            [item.dir_group_id]: {
              cloud_role_id: item.cloud_role_id,
              dir_group_id: item.dir_group_id,
              dir_group_name: item.dir_group_name,
            },
          };
        });
        this.form.rolesItemsArray = Object.values(this.rolesValues);
        this.form.rolesItemsArray = this.form.rolesItemsArray.filter(
          (item) => !!item.cloud_role_id
        );

        this.getIntgData.fields_mappings.forEach((item) => {
          this.dirMapValues = {
            ...this.dirMapValues,
            [item.dir_field_id]: {
              dir_field_id: item.dir_field_id,
              cloud_field_id: item.cloud_field_id,
            },
          };
        });
        this.form.dirMapValuesArray = Object.values(this.dirMapValues);
        this.form.dirMapValuesArray = this.form.dirMapValuesArray.filter(
          (item) => !!item.cloud_field_id
        );
      }
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("integration", [
      "getIntegId",
      "getCreatedIntegration",
      "getIntgData",
      "getLoading",
      "getConfigData",
      "getUsersWithDuplicatesCount",
      "getUsersWithErrsCount",
      "getIsEdit",
      "getFromView",
      "getErrMsg",
    ]),
    ...mapGetters("authfack", ["currentEntity"]),
    dropdownValues() {
      return Object.values(this.dirMapValues)
        .filter((item) => !!item.cloud_field_id)
        .map((item) => item.cloud_field_id);
    },
  },
  mounted() {
    // this.getIntegration(this.getIntegId);
    console.log(
      "getIntegId",
      this.getIsEdit,
      this.getIntegId,
      this.getIntgData,
      this.sitesOptions
    );
    console.log(this.getModalInfo);
    this.resetFormWithIntgData();

    // this.getIntgDataCopy = JSON.parse(JSON.stringify(this.getIntgData));

    // mapping field configuration

    // this.groupTextFields = this.data.groups;
  },
  created() {},
};
</script>
<style lang="scss"  scoped>
// .text-danger.border{
//   border: 1.5px solid #F46A6A!important;
// border-radius: 4px!important;

// }
.font-weight-bolder {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.25px;
  color: #f46a6a;
  padding-left: 20px !important;
}
.second {
  padding-top: 12px !important;
}
a {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.25px;
  text-decoration-line: underline !important;
  color: #103f5e !important;
}
.note {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.25px;
  color: #939393;
  padding: 26px 0 38px 0;
}
note-center{
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.25px;
  color: #939393;
  
  padding: 26px 0 38px 0;
  text-align: center;
}
.light-grey {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #c7c7c7;
}
h4.upper-case {
  font-family: "Lato" !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  line-height: 17px !important;
  letter-spacing: 0.25px !important;
  text-transform: uppercase !important;
  color: #000000 !important;
}
label.intName {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400!important;
  font-size: 16px!important;
  line-height: 17px!important;
  letter-spacing: 0.25px!important;

  color: rgba(96, 96, 96, 0.87) !important;

  opacity: 0.8 !important;
}
label.intName.itnName-type {
   font-family: 'Lato';
font-style: normal;
font-weight: 700!important;
font-size: 12px!important;
line-height: 17px!important;
letter-spacing: 0.25px!important;
color: #103F5E!important;
opacity: 0.8!important;
}
.width-32 {
  width: 32%;
}
.width-40 {
  width: 40%;
}
.width-45 {
  width: 45%;
}
.disable-field {
  background: #f2f2f2 !important;
  opacity: 0.6 !important;
  border-radius: 4px !important;
  label {
    opacity: 0.2 !important;
  }
  input {
    opacity: 0.2 !important;
  }
  .form-control {
    opacity: 0.2 !important;
  }
}
.height-55 {
  height: 55px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.25px;
  background: #f2f2f2
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
    no-repeat right 0.75rem center/8px 10px;
  border: none;
  color: #787878;
  border-radius: 4px;
}
.input-group {
  width: 40% !important;
}
.dark-grey {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #939393;
}

.mapping-fields {
  label {
    background-color: #f2f2f2;
    width: 110px;
    height: 55px;
    margin-right: 15px;
    border-radius: 7px;
    text-align: center;
    color: #787878;
    font-size: 16px;
    font-weight: 700;
    padding-top: 15px;
    padding-left:20px;
    padding-right:20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  
  display: inline;
  position: relative;

    
  }

  input {
    font-weight: 700;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.25px;
    color: #787878;
  }
  .form-control {
    height: 55px;
    border-radius: 7px;
    padding: 20px;
    font-family: 'Lato';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 17px;
letter-spacing: 0.25px;
color: #787878;
overflow:hidden;
white-space: nowrap;
text-overflow: ellipsis;
  }
}

.mapping-select .custom-select {
  padding: 40px;
  background-color: #50a5f1 !important;
}
.field-map-wrap {
  .key-field {
    display: inline-block;
    background-color: #f2f2f2;
    height: 57px;
    margin-right: 5px;
    padding: 14px 15px;
    border-radius: 4px;
    color: #787878;
    font-size: 16px;
  }
  .input-wrapper {
    display: inline-block;
    width: 100%;
  }
}

.wrapper {
  background-color: white;
  padding-left: 30px;
  padding-top: 32px;
  border-radius: 5px;
  padding-bottom: 30px;
  padding-right: 30px;
  .content {
    margin-top: 0px;
  }
}

.form-control {
  background-color: #f2f2f2;
  border-color: #f2f2f2;
}
.custom-tag .form-control {
  background-color: white;
  border: 0px;
  padding: 0px;
}
.custom-tag .form-control .custom-select {
  background-color: #f2f2f2;
  border-color: #f2f2f2;
  color: #797d91;
  width: 31.7%;
}

.mdi-arrow-right-box {
  font-size: 30px !important;
  padding: 0px !important;
  color: #000000;
  position: absolute;
  bottom: 0;
  right: 90px;
}

@import "@/design/user_form_modals.scss";
.change-text {
  text-decoration: underline !important;
  color: #50a5f1;
}
.delete-icon {
  font-size: 1.3rem;
  margin-left: 8px;
  cursor: pointer;
}
.user-types-select {
  z-index: 1100;
}
.user-roles {
  z-index: 999;
}
p {
  display: block;
  color: #939393;
}
.header-close {
  font-size: 24px !important;
  font-weight: bold !important;
  background-color: transparent;
  border: none;
}

.header-close:active {
  outline: none;
}

h5.modal-title {
  width: 100%;
  text-align: center;
  font-size: 19px;
  font-weight: 700;
}

</style>

<style lang="scss">
div#mappingChangedWarning___BV_modal_content_ {
  width: 579px !important;
  height: 324px !important;
  h4.modal-title {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
    color: #000000;
    text-align: left;
    margin-bottom: 35px !important;
  }
  .modal-paragraph {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    font-size: 20px !important;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.25px;
    color: #939393;
  }
  .modal-smallParagraph {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.25px;
    color: #939393;
    margin-bottom: 21px !important;
    .bold-word {
      font-weight: 700 !important;
    }
  }
  .line {
    width: 488.16px !important;
    height: 1px !important;
    opacity: 0.15;
    background: #707070;
  }
  .modal-buttonSize {
    width: 111.69px !important;
    height: 33.26;
    margin-top: 20px !important;
    margin-bottom: 19.75px !important;
  }
}
.invalid-field {
  .form-control {
    background-color: transparent !important;
    border-color: transparent !important;
    
  }
}
.form-group.m-d-gruop.invalid-field {
    margin-bottom: 12px!important;
}
.submit-btn.btn.btn-primary.custom-loader {
  width: 120px;
}
.custom-activeRadio.space
  .custom-radio
  .custom-control-input:checked
  ~ .custom-control-label
  span {
  padding-left: 24px !important;
  padding-right: 64px !important;
  font-family: 'Lato';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 17px;
letter-spacing: 0.25px;
color: #103F5E;
opacity: 0.8;
}
.custom-activeRadio.space .custom-radio .custom-control-label span {
  padding-left: 20px !important;
  padding-right: 81px !important;
  font-family: 'Lato';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 17px;
letter-spacing: 0.25px;
color: rgba(96, 96, 96, 0.87);
opacity: 0.8;
}
.custom-activeRadio.space .custom-radio .custom-control-label::after {
  top: 0.26rem;
}
.custom-activeRadio.space .custom-radio .custom-control-label::before {
  top: 0rem;
}
.custom-activeRadio.second .custom-radio .custom-control-label::after {
  top: 0.25rem;
}
.int-dropDown {
  span.multiselect__tag{
      margin-bottom:1.5px!important;
    }
  .multiselect__tags {
    position: relative;
    display: flex;
    border: none !important;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: #f2f2f2 !important;
    height: 55px;
    width: 400px;
    //
  }
  .multiselect__placeholder {
    position: absolute;
    top: 18px !important;
    left: 20px !important;
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.25px;
    color: #787878;
  }
  .multiselect {
    width: 442px !important;
    border-radius: 4px;
    background: #f2f2f2 !important;
    height: 55px;
    position: relative;
    border: none;
  }
  .multiselect__select:before {
    position: absolute;
    content: "";
    border-color: #636161 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    width: 5px;
    height: 5px;
    top: 19px !important;
    left: 0px !important;
  }
  .multiselect__tag {
    /* min-width: 111px; */
    height: 39px;
    display: flex;
    padding: 10px 40px 10px 20px;
    // position: relative;
    align-items: center;
    background: #103f5e;
    border-radius: 27.5px !important;
    display: inline-block !important;
    vertical-align: middle !important;
    bottom: -20px;
    left: 2%;
    
    span {
      display: inline-block !important;
      vertical-align: middle !important;
      font-family: 'Lato';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 17px;
      letter-spacing: 0.25px;
      color: #FFFFFF;
    }
    i {
      position: absolute;
      top: 25%;

      right: 8%;
      width: 20px;
      height: 20px;
      text-align: center;
      border-radius: 100%;
      background-color: #ffffff !important;
      
    }
  }
  .multiselect__tag-icon:after {
    color: #103f5e !important;
    position: absolute;
    top: -2px;
    right: 12%;
    font-weight: 900px !important;
    font-size: 25px !important;
  }

  .isActive {
    height: 115px !important;

    position: relative;
    .multiselect__tags {
      position: absolute;
      height: 115px !important;
    }

    .multiselect__tags::after {
      content: "Sites";
      position: absolute;
      font-family: "Lato";
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      line-height: 17px;
      top: 18px !important;
      left: 26px !important;
      letter-spacing: 0.25px;
      color: #103f5e;
    }
  }

  input#site {
    background-color: #f2f2f2 !important;
    display: none;
  }
  .multiselect__input {
    width: 442px !important;
  }
  input#site.multiselect__placeholder {
    position: absolute;
    top: 18px !important;
    left: 20px !important;
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 17px;
    /* identical to box height, or 106% */

    letter-spacing: 0.25px;

    color: #787878;
  }
  .multiselect--active {
    position: relative;
    .multiselect__select:before {
      position: absolute;
      content: "";
      border-color: #636161 transparent transparent;
      border-style: solid;
      border-width: 5px 5px 0;
      width: 5px;
      height: 5px;
      top: 24% !important;
      left: 35% !important;
      transform: rotateX(180deg);
    }
  }
}
.content ul {
  margin-left: 0 !important ;
}
.flex-column {
  position: relative;
}
h6 {
  padding-bottom: 30px !important;
  padding-left: 20px !important;
  padding-top: 40px !important;
}
</style>