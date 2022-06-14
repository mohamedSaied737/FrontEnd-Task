<script>
import { mapActions, mapGetters } from "vuex";
import {
  email,
  numeric,
  maxLength,
  requiredIf,
} from "vuelidate/lib/validators";
import VueCountryCode from "vue-country-code";

export default {
  name: "PassportAction",
  components: { VueCountryCode },
  data() {
    return {
      multipleSelected: false,
      user_id: null,
      users_ids: null,
      form: {
        email: null,
        phone: null,
        system_user: true,
      },
      submitted: false,
      user_role: { id: "System User", name: "System User" },
      user_roles_list: [{ id: "System User", name: "System User" }],
      phone_input: null,
      updatePhone: false,
    };
  },
  validations: {
    form: {
      email: {
        email,
        required: requiredIf(function() {
          const {
            form: { phone },
          } = this;
          return phone ? false : true;
        }),
      },
    },
    phone_input: {
      numeric,
      maxLength: maxLength(50),
      required: requiredIf(function() {
        const {
          form: { email,phone },
        } = this;
        return email || phone ? false : true;
      }),
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("users", ["getLoading"]),
    ...mapGetters("authfack", ["currentEntity"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("passportAction");
    },
    phone_input(phone_input) {
      this.form.phone =
        phone_input && phone_input.length > 0
          ? `${this.userCountryCode}${phone_input}`
          : null;
    },
  },
  methods: {
    ...mapActions("users", ["inviteInvokeUser", "resetLoading"]),
    onSubmit() {
      this.submitted = true;
      this.$v.$touch();
      const {
        user_id,
        currentEntity,
        getModalInfo,
        users_ids,
        multipleSelected,
        inviteInvokeUser,
        form: { email, phone },
      } = this;

      if (!this.$v.$error) {
        inviteInvokeUser({
          user_ids: multipleSelected ? users_ids : [user_id],
          entity_id: currentEntity.id,
          type: getModalInfo.type,
          data: {
            email,
            phone,
            system_user: getModalInfo.type == "revoke" ? 0 : 1,
          },
        });
      }
    },
    onSelectUserCountryCode({ dialCode }) {
      this.userCountryCode = dialCode;
    },
    onUpdatePhone() {
      this.updatePhone = true;
    },
  },
  beforeMount() {
    this.resetLoading();
    this.form.phone = this.getModalInfo.data.phone;
    this.form.email = this.getModalInfo.data.email;
    if (Array.isArray(this.getModalInfo.data)) {
      this.multipleSelected = true;
      this.users_ids =
        this.getModalInfo.data.length > 0 &&
        this.getModalInfo.data.map((user) => user.UniqueId);
    } else {
      this.user_id = this.getModalInfo.data.id;
    }
  },
};
</script>

<template>
  <div class="wrapper">
    <p class="title">
      {{
        getModalInfo.type == "invite"
          ? "Invite User to Dashboard"
          : "Revoke User from Dashboard"
      }}
    </p>
    <div class="content">
      <!-- invite  -->
      <div v-if="getModalInfo.type == 'invite'">
        <!-- new email  -->
        <div class="email-input">
          <div class="input-wrapper">
            <div class="form-group m-d-gruop ">
              <b-form-input
                id="email"
                name="email"
                type="email"
                v-model="form.email"
                required
              />
              <label for="phone">Email Address</label>
            </div>
          </div>
          <div class="err-wrapper">
            <div v-if="submitted && !$v.form.email.email">
              <span class="error-value">Invalid email address</span>
            </div>
            <div v-if="submitted && !$v.form.email.required">
              <span class="error-value">Email address is required</span>
            </div>
          </div>
        </div>
        <!-- current phone  -->
        <div
          class="current-phone"
          v-if="getModalInfo.data.phone && !updatePhone"
        >
          <label for="phone" class="label d-none d-md-block"
            >Phone number:</label
          >
          <div class="phone-numbe-wrapper">
            <p id="phone" class="phone-number">
              {{ getModalInfo.data.phone ? `+${getModalInfo.data.phone}` : "" }}
            </p>
            <p @click="onUpdatePhone" class="update-text">Change Number</p>
          </div>
        </div>
        <!-- new phone  -->
        <div v-if="updatePhone || !getModalInfo.data.phone" class="phone-input">
          <div class="input-wrapper">
            <div class="row-group phone-group justify-content-start">
              <VueCountryCode
                class="country-code-input"
                :disabledFetchingCountry="false"
                @onSelect="onSelectUserCountryCode"
                :enabledCountryCode="true"
                :preferredCountries="['GB', 'US', 'CN']"
              />
              <div
                class="form-group m-d-gruop"
                :class="$v.phone_input.$error && 'invalid-value'"
              >
                <b-form-input
                  id="phone"
                  v-model.trim="phone_input"
                  type="text"
                  required
                />
                <label for="phone">Phone Number</label>
              </div>
            </div>
          </div>
          <div class="err-wrapper">
            <div v-if="submitted && !$v.phone_input.numeric">
              <span class="error-value">
                Phone number should contain only digits
              </span>
            </div>
            <div v-else-if="submitted && !$v.phone_input.maxLength">
              <span class="error-value">
                You exceeds phone number maximum length
              </span>
            </div>
          </div>
        </div>
        <hr class="h-line input-h-line" />
        <div class="select-input-wrapper role-input select-role">
          <div class="input-wrapper">
            <multiselect
              id="server"
              class="custom-multi-select"
              v-model="user_role"
              :options="user_roles_list"
              placeholder="User Role"
              label="name"
              :show-labels="false"
              :allowEmpty="true"
              disabled
            />
          </div>
        </div>
      </div>
      <!-- revoke  -->
      <div v-else>
        <p class="revoke-confirmation">
          Are you sure you want Revoke {{ getModalInfo.data.fullName }} from
          dashboard?
        </p>
      </div>
    </div>
    <hr class="h-line action-h-line" />
    <!-- invite actions  -->
    <div class="action-btns" v-if="getModalInfo.type == 'invite'">
      <button
        class="submit-btn btn btn-primary"
        size="md"
        @click="onSubmit"
        :disabled="getLoading || !(form.email || form.phone)"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span v-else>Invite</span>
      </button>
      <button
        class="btn btn-outline-danger"
        @click="$bvModal.hide('passportAction')"
      >
        Cancel
      </button>
    </div>
    <!-- revoke actions  -->
    <div class="action-btns" v-else>
      <button
        class="cancel-btn btn btn-primary"
        @click="$bvModal.hide('passportAction')"
      >
        Cancel
      </button>
      <button class="btn btn-outline-danger" size="md" @click="onSubmit">
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span v-else>Revoke</span>
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  .content {
    padding: 0 10px;
  }
  .input-label {
    font-weight: normal;
    font-size: 14px;
    letter-spacing: 0.25px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 30px;
  }
  .email-input {
    margin-bottom: 25px;
  }
  .current-phone {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
    padding-left: 18px;
    .label {
      font-weight: normal;
      font-size: 16px;
      line-height: 17px;
      letter-spacing: 0.25px;
      color: rgba(96, 96, 96, 0.87);
      opacity: 0.8;
    }
    .phone-numbe-wrapper {
      text-align: right;
      .phone-number {
        font-weight: bold;
        font-size: 16px;
        line-height: 17px;
        letter-spacing: 0.25px;
        color: rgba(0, 0, 0, 0.87);
        opacity: 0.8;
        margin-bottom: 11px;
      }
      .update-text {
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.25px;
        color: #103f5e;
        text-decoration: none;
        margin-bottom: 0;
        cursor: pointer;
      }
    }
  }
  .phone-input {
    margin-bottom: 3px;
  }
  .vue-country-select {
    height: 57px;
    margin-right: 0.7rem;
    border: 0;
    border-radius: 4px !important;
    width: 120px;
    &:focus div {
      outline: none !important;
      border: 0 !important;
    }
    background: #f2f2f2;
    color: #606060;
  }
  .row-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .input-h-line {
    margin: 23px 0 19px 0;
  }
  .action-h-line {
    margin: 30px 0 19px 0;
  }
  .err-wrapper {
    margin-top: 0;
    padding-left: 19px;
  }
  .select-role {
    .input-wrapper {
      display: flex;
      align-items: center;
      background-color: #f3f3f3;
      height: 55px;
    }
  }
  .revoke-confirmation {
    font-weight: normal;
    font-size: 20px;
    text-align: center;
    color: #787878;
  }
  .cancel-btn {
    margin-right: 30px;
  }
}
</style>
