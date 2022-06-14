<script>
import Layout from "../../layouts/auth";
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  title: "Login",
  components: {
    Layout,
  },
  data() {
    return {
      data: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      loader: this.$store ? this.$store.state.layout.loader : {} || {},
    };
  },
  validations: {
    data: {
      required,
    },
    password: {
      required,
    },
  },
  watch: {
    password(pass) {
      this.saveUserPassword(pass);
    },
  },
  computed: {
    ...mapGetters("authfack", ["loadingStatus", "getEntityByDomain"]),
    disableBtn() {
      return (
        this.data.length > 0 && this.password.length > 0 && !this.loadingStatus
      );
    },
  },
  methods: {
    ...mapActions("authfack", [
      "onEntityBySubdomain",
      "saveUserPassword",
      "clearStore",
      "login",
    ]),
    tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const { data, password, getEntityByDomain } = this;
        if (data && password) {
          this.login({
            data,
            password,
            entity_id: getEntityByDomain && getEntityByDomain.id,
          });
        }
      }
    },
  },
  beforeMount() {
    this.clearStore();
  },
  mounted() {
    const hostname = window.location.hostname;
    this.onEntityBySubdomain({ subdomain: hostname });
  },
};
</script>

<template>
  <Layout>
    <div class="login-wrapper">
      <div class="login-form">
        <div class="header">
          <div class="text-primary">
            <h3 class="text-primary">Welcome</h3>
            <p class="mb-0">Sign in to continue.</p>
          </div>
          <img
            src="@/assets/images/logo-lg.svg"
            alt="visipoint_logo"
            width="25%"
          />
        </div>
        <b-form @submit.prevent="tryToLogIn">
          <b-form-group
            id="input-group-1"
            label="Email or Phone Number"
            label-for="input-1"
          >
            <b-form-input
              autofocus
              id="input-1"
              v-model.trim="data"
              type="text"
              placeholder="Enter email/mobile number"
              :class="{ 'is-invalid': submitted && $v.data.$error }"
            ></b-form-input>
            <div v-if="submitted && $v.data.$error" class="invalid-feedback">
              <span v-if="!$v.data.required">Email or phone is required.</span>
            </div>
          </b-form-group>

          <b-form-group id="input-group-2" label="Password" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="password"
              type="password"
              placeholder="Enter password"
              :class="{ 'is-invalid': submitted && $v.password.$error }"
            ></b-form-input>
            <div
              v-if="submitted && !$v.password.required"
              class="invalid-feedback"
            >
              Password is required.
            </div>
          </b-form-group>
          <b-button
            variant="primary"
            type="submit"
            pill
            :disabled="!disableBtn"
            class="submit-btn"
          >
            <span>
              <i
                v-if="loadingStatus"
                class="
                        bx bx-loader bx-spin
                        font-size-16
                        align-middle
                        mr-2
                      "
              ></i>
              <span v-else>LogIn</span>
            </span>
          </b-button>
        </b-form>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form {
    background-color: #fff;
    padding: 40px;
    border-radius: 15px;
    width: 480px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 35px;
    }
  }
}
.submit-btn {
  width: 100%;
  margin-top: 35px;
  text-transform: uppercase;
}
</style>
