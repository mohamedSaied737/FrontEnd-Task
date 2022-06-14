<script>
import { mapGetters, mapActions } from "vuex";
import {
  required,
  between,
  numeric,
  requiredIf,
} from "vuelidate/lib/validators";
import store from "@/state/store";
import Multiselect from "vue-multiselect";
import ImageUploader from "vue-image-upload-resize";
import VueCountryCode from "vue-country-code";

export default {
  name: "UserForm",
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
  components: { Multiselect, ImageUploader, VueCountryCode },
  data() {
    return {
      form: {
        user: {
          first_name: null,
          last_name: null,
          email: null,
          phone: null,
          image: null,
          user_type_id: null,
          rfid_number: null,
          user_user_id: null,
          system_user: false,
          department_id: null,
          role_id: null,
        },
        entity: {
          entity_id: null,
        },
      },
      imageToDisplay: null,
      hasPassword: null,
      userTypes: [],
      roles: [],
      departments: [],
      submitted: false,
      update: false,
      imageSizeError: "",
      userProfile: null,
      hasImage: false,
      imgSpinner: false,
      userCountryCode: null,
      countryCodeChanged: false,
      imgMinSizeErr: false,
      userPhone: null,
      currentPhone: true,
      userRole: null,
      user_roles_list: [{ id: "System User", name: "System User" }],
    };
  },
  validations: {
    form: {
      user: {
        first_name: { required },
        last_name: { required },
        email: {
          required: requiredIf(function () {
            const {
              form: {
                user: { phone, system_user },
              },
            } = this;
            return system_user && !phone;
          }),
        },
        phone: {},
        user_type_id: { required },
        user_user_id: { required },
        system_user: {
          required,
          between: between(0, 1),
        },
      },
    },
    userPhone: {
      required: requiredIf(function () {
        const {
          form: {
            user: { email, system_user, phone },
          },
        } = this;
        return system_user && !email && !phone;
      }),
      numeric,
    },
  },
  computed: {
    ...mapGetters("users", [
      "getLoading",
      "getUserRoles",
      "getDepartments",
      "getFormErrors",
      "getModalState",
    ]),
    ...mapGetters("userType", ["getAllUsersTypes"]),
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("authfack", ["currentEntity"]),
    getPhone() {
      return `${this.userCountryCode}${this.form.user.phone}`;
    },
  },
  watch: {
    "form.user.image"(imgObj) {
      if (typeof imgObj == "object") {
        this.imageToDisplay = URL.createObjectURL(imgObj);
      }
    },
    getModalState(state) {
      state == true && this.$bvModal.hide("add-edit-user");
    },
    userRole(role) {
      if (role && role.id == "System User") {
        this.form.user.system_user = true;
      } else {
        this.form.user.system_user = false;
      }
    },
    userPhone(phone) {
      if (phone && phone / length > 0) {
        this.form.user.phone = `${this.userCountryCode}${phone}`;
      } else {
        this.form.user.phone = null;
      }
    },
  },
  mounted() {
    this.fetchAllUserType();
    this.fetchUserRoles();
    this.fetchDepartments();
    this.updateUserInformation();
    Object.keys(this.$route.params).length > 1
      ? (this.form.user.user_type_id = this.$route.params)
      : "";
  },
  methods: {
    ...mapActions("authfack", ["fetchuserDetails"]),
    ...mapActions("users", [
      "createUser",
      "updateUserAction",
      "fetchUserRoles",
      "fetchDepartments",
    ]),
    ...mapActions("userType", ["fetchAllUserType"]),
    dataURLtoFile(dataUrl, fileName) {
      let arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
    setImage: function (output) {
      if (output.info.orgHeight <= 300 || output.info.orgWidth <= 250) {
        this.imgMinSizeErr = true;
      } else {
        this.imgMinSizeErr = false;
        this.hasImage = true;
        const obj = this.dataURLtoFile(output.dataUrl, output.info.name);
        this.form.user.image = obj;
      }
    },
    startImageResize() {
      this.imgSpinner = true;
    },
    endImageResize() {
      this.imgSpinner = false;
    },
    updateUserInformation() {
      console.log('update', this.getModalInfo);
      if (this.getModalInfo && Object.keys(this.getModalInfo).length) {
        let entity = store.getters["authfack/currentEntity"];
        const user = this.form.user;
        const userData = this.getModalInfo;
        this.hasPassword =
          userData.current_entity && userData.current_entity.hasPassword;
        let imageProfile = userData.image;
        if (imageProfile !== null) {
          imageProfile = imageProfile.replace("entity_id", entity.id);
        }
        this.update = true;
        this.imageToDisplay = imageProfile;
        user.user_user_id = userData.user_user_id;

        user.system_user = userData.system_user == 1 ? true : false;
        user.rfid_number = userData.rfid_number;
        user.user_type_id = userData.current_entity.user_type;
        // personal info
        user.first_name = userData.first_name;
        user.last_name = userData.last_name;
        user.email = userData.email;
        user.phone = userData.phone;
        // hide current phone wrapper if phone is null.
        if (!userData.phone) {
          this.currentPhone = false;
        }
        if (userData.system_user == 1) {
          this.userRole = { id: "System User", name: "System User" };
        }
      }
    },
    generateUserID() {
      let length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      let i = 0,
        n = charset.length;
      for (; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      this.form.user.user_user_id = "VP-" + retVal;
    },
    onSubmit() {
      this.submitted = true;
      this.$v.$touch();
      this.$v.$error ? "" : this.submission();
    },
    submission() {
      const { createUser, updateUserAction, update } = this;
      const { entity_id } = this.form.entity;
      const {
        user_user_id,
        first_name,
        last_name,
        email,
        phone,
        image,
        rfid_number,
        user_type_id,
        system_user,
        password,
      } = this.form.user;
      let formData = new FormData();
      formData.append("entity_id", entity_id);
      formData.append("user_user_id", user_user_id);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      (email || update) && formData.append("email", email ? email : null);
      (phone || update) && formData.append("phone", phone ? phone : null);
      image && formData.append("image", image);
      (rfid_number || update) && formData.append("rfid_number", rfid_number);
      formData.append("user_type_id", user_type_id ? user_type_id.id : null);
      formData.append("system_user", system_user == true ? 1 : 0);
      password && formData.append("password", password);
      update
        ? updateUserAction({ id: this.data.id, user: formData })
        : createUser(formData);
    },
    onSelectUserCountryCode({ dialCode }) {
      this.userCountryCode = dialCode;
    },
    onChangeToUpdatePhone() {
      this.currentPhone = false;
    },
  },
  beforeMount() {
    this.form.entity.entity_id = this.currentEntity.id;
  },
};
</script>

<template>
  <b-row class="main-user-form">
    <b-col cols="12">
      <b-row>
        <b-form id="form" class="form-horizontal" @submit.prevent="onSubmit">
          <div class="card custom-card personal-information">
            <template v-if="getModalInfo && !getModalInfo.is_default_user">
              <div
                class="
                  d-flex
                  justify-content-between
                  align-items-center
                  border-bottom
                  pb-3
                "
              >
                <!-- user image  -->
                <div class="user-avatar d-flex">
                  <image-uploader
                    outputFormat="verbose"
                    :debug="1"
                    :maxWidth="3000"
                    :maxHeight="2688"
                    :quality="0.7"
                    :preview="false"
                    :autoRotate="true"
                    :className="[
                      'fileinput',
                      { 'fileinput--loaded': hasImage },
                    ]"
                    :capture="false"
                    accept="image/*"
                    @input="setImage"
                    @onUpload="startImageResize"
                    @onComplete="endImageResize"
                  >
                    <label for="fileInput" slot="upload-label">
                      <div class="d-flex align-items-center">
                        <b-avatar
                          v-if="!imgSpinner"
                          :variant="imageToDisplay ? 'light' : 'secondary'"
                          class="user-avatar"
                          :src="imageToDisplay"
                          size="5.8rem"
                        />
                        <b-spinner
                          class="spinner-grow"
                          v-else
                          type="grow"
                          variant="primary"
                          role="status"
                        ></b-spinner>
                        <i class="mdi mdi-camera-plus upload-icon"></i>
                      </div>
                    </label>
                  </image-uploader>
                </div>
                <p v-if="userRole" class="system-user-text text-primary">
                  System User
                </p>
              </div>
              <p
                v-if="imgMinSizeErr"
                class="mb-0 text-danger border-bottom py-1"
              >
                The image shouldn’t be less than 250px*300px
              </p>
              <div class="row my-3">
                <!-- ID -->
                <div class="col-sm-12 col-md-6 my-2">
                  <div class="d-flex align-items-center">
                    <label class="mb-0" id="user-id" for="user-id">ID</label>
                    <div v-if="!form.user.user_user_id">
                      <b-button
                        class="p-0 mx-2 font-weight-bold"
                        variant="link"
                        @click="generateUserID"
                        >Generate</b-button
                      >
                    </div>
                  </div>
                  <b-form-input
                    name="user_user_id"
                    id="user-id"
                    placeholder="Add ID"
                    v-model="form.user.user_user_id"
                    :class="{
                      'is-invalid':
                        submitted && $v.form.user.user_user_id.$error,
                    }"
                  />
                  <div
                    class="text-danger"
                    v-if="submitted && !$v.form.user.user_user_id.required"
                  >
                    <span class="font-size-15 font-weight-normal"
                      >User Id is required</span
                    >
                  </div>
                </div>
                <!-- RFID -->
                <div class="col-sm-12 col-md-6 my-2">
                  <label class="mb-0" id="rfid" for="rfid">RFID</label>
                  <b-form-input
                    class="input-hide-arrow"
                    name="rfid_number"
                    id="rfid"
                    placeholder="Add RFID"
                    v-model="form.user.rfid_number"
                    type="number"
                    @wheel="$event.target.blur()"
                  />
                </div>
              </div>
            </template>
            <div class="form-groups">
              <h5 class="text-muted mb-2">Personal Information</h5>
              <template v-if="getModalInfo && !getModalInfo.is_default_user">
                <!-- user type  -->
                <b-form-group
                  label-cols-sm="4"
                  label-cols-lg="4"
                  id="userType"
                  label="User type"
                  label-for="userType"
                >
                  <div>
                    <multiselect
                      id="userType"
                      class="user-types-select"
                      v-model="form.user.user_type_id"
                      :options="getAllUsersTypes"
                      placeholder="Select User Type"
                      :show-labels="false"
                      label="name"
                      :allowEmpty="true"
                      :class="{
                        'has-error':
                          submitted &&
                          $v.form.user.user_type_id &&
                          !$v.form.user.user_type_id.required,
                      }"
                      :disabled="
                        !this.update &&
                        Object.keys(this.$route.params).length > 0
                          ? true
                          : false
                      "
                    >
                      <template slot="option" slot-scope="props">
                        <div class="option__desc">
                          <span
                            v-if="props.option.children"
                            class="option__name font-weight-bold"
                            >{{ props.option.name }}</span
                          >
                          <span
                            v-else
                            class="
                              option__usertype__child
                              font-weight-bold
                              ml-1
                            "
                            >- {{ props.option.name }}</span
                          >
                        </div>
                      </template>
                    </multiselect>
                    <div
                      v-if="submitted && !$v.form.user.user_type_id.required"
                      class="text-danger"
                    >
                      <span class="font-size-15 font-weight-normal"
                        >User Type is required</span
                      >
                    </div>
                  </div>
                </b-form-group>
              </template>
              <!-- first name  -->
              <b-form-group
                label-cols-sm="4"
                label-cols-lg="4"
                id="first-name"
                label="First Name"
                label-for="first-name"
              >
                <div>
                  <b-form-input
                    id="first-name"
                    name="first_name"
                    v-model="form.user.first_name"
                    placeholder="Add First Name"
                    :class="{
                      'is-invalid': submitted && $v.form.user.first_name.$error,
                    }"
                  />
                  <div
                    class="text-danger"
                    v-if="submitted && !$v.form.user.first_name.required"
                  >
                    <span class="font-size-15 font-weight-normal"
                      >First Name is required</span
                    >
                  </div>
                </div>
              </b-form-group>
              <!-- last name  -->
              <b-form-group
                label-cols-sm="4"
                label-cols-lg="4"
                id="last-name"
                label="Last Name"
                label-for="last-name"
              >
                <div>
                  <b-form-input
                    id="last-name"
                    name="last_name"
                    v-model="form.user.last_name"
                    placeholder="Add Last Name"
                    :class="{
                      'is-invalid': submitted && $v.form.user.last_name.$error,
                    }"
                  />
                  <div
                    class="text-danger"
                    v-if="submitted && !$v.form.user.last_name.required"
                  >
                    <span class="font-size-15 font-weight-normal"
                      >Last Name is required</span
                    >
                  </div>
                </div>
              </b-form-group>
              <template v-if="getModalInfo && !getModalInfo.is_default_user">
                <!-- email  -->
                <b-form-group
                  label-cols-sm="4"
                  label-cols-lg="4"
                  id="email"
                  label="Email"
                  label-for="email"
                >
                  <div>
                    <b-form-input
                      name="email"
                      v-model="form.user.email"
                      placeholder="Add Email Address"
                      :class="{
                        'is-invalid': submitted && $v.form.user.email.$error,
                      }"
                    />
                  </div>
                </b-form-group>
                <!-- phone  -->
                <b-form-group
                  label-cols-sm="4"
                  label-cols-lg="4"
                  id="phone"
                  label="Phone"
                  label-for="phone"
                >
                  <div
                    v-if="update && currentPhone"
                    class="current-phone d-flex align-items-center"
                  >
                    <p class="mb-0">{{ form.user.phone }}</p>
                    <a @click="onChangeToUpdatePhone" class="change-text ml-2"
                      >Change</a
                    >
                  </div>
                  <div v-else class="phone-input-wrapper">
                    <VueCountryCode
                      :disabledFetchingCountry="false"
                      @onSelect="onSelectUserCountryCode"
                      :enabledCountryCode="true"
                      :preferredCountries="['GB', 'US', 'CN']"
                    />
                    <b-form-input
                      id="phone"
                      name="phone"
                      v-model="userPhone"
                      placeholder="Add Phone Number"
                      :class="{
                        'is-invalid': submitted && $v.userPhone.$error,
                      }"
                    />
                  </div>
                  <div
                    class="text-danger"
                    v-if="submitted && !$v.userPhone.required"
                  >
                    <span>Phone or email is required to be a system user</span>
                  </div>
                  <div
                    v-if="submitted && !$v.userPhone.numeric"
                    class="text-danger w-100"
                  >
                    <span>Phone number should contain only digits.</span>
                  </div>
                </b-form-group>
                <!-- role  -->
                <b-form-group
                  v-if="update && form.user.system_user"
                  label-cols-sm="4"
                  label-cols-lg="4"
                  label="User Role"
                >
                  <div class="d-flex align-items-center">
                    <multiselect
                      id="user_role"
                      class="custom-multi-select user-roles"
                      v-model="userRole"
                      :options="user_roles_list"
                      placeholder="Select User Type"
                      :show-labels="false"
                      label="name"
                      :allowEmpty="true"
                      disabled
                    >
                    </multiselect>
                    <i
                      v-if="false"
                      @click="userRole = null"
                      class="mdi mdi-close-thick delete-icon"
                    ></i>
                  </div>
                </b-form-group>
              </template>
            </div>
            <b-row class="actions flex-row pl-3">
              <div
                class="
                  text-center
                  flex-row
                  justify-content-center
                  w-100
                  form-btn
                  flex-row
                "
              >
                <b-button
                  variant="primary"
                  type="submit"
                  pill
                  :disabled="getLoading"
                  class="text-center mt-2 px-5"
                >
                  <i
                    v-if="getLoading"
                    class="bx bx-loader bx-spin font-size-16 align-middle mr-2"
                  ></i>
                  <span v-else>
                    {{ this.update ? "Update" : "Submit" }}
                  </span>
                </b-button>
              </div>
            </b-row>
          </div>
        </b-form>
      </b-row>
    </b-col>
  </b-row>
</template>

<style lang="scss">
@import "@/design/user_form_modals.scss";
#fileInput {
  display: none;
}
.upload-icon {
  cursor: pointer;
  font-size: 2.1rem;
  color: #4a4a4a;
  margin-left: 0.8rem;
  transition: 0.5s;
  &:hover {
    color: #103f5e;
  }
}
.spinner-grow {
  width: 5.8rem;
  height: 5.8rem;
}
.change-text {
  text-decoration: underline !important;
  color: #50a5f1;
}
.delete-icon {
  font-size: 1.3rem;
  margin-left: 8px;
  cursor: pointer;
}
.system-user-text {
  margin-bottom: 0;
  margin-right: 5px;
  font-weight: bold;
}
.user-types-select {
  z-index: 1100;
}
.user-roles {
  z-index: 999;
}
</style>
