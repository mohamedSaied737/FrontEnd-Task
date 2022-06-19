<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("authfack", ["userDetails", "currentEntity"]),
    handleUserImage() {
      const {
        userDetails: { image },
        currentEntity,
      } = this;
      return image ? image.replace("entity_id", currentEntity.id) : null;
    },
  },
  methods: {
    ...mapActions("authfack", ["logout"]),
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    redirectLogin() {
      this.logout();
    },
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header flex-row">
      <div class="d-flex navbar-inner">
        <!-- LOGO -->
        <div class="navbar-brand-box text-left">
          <div class="logo logo-dark">
            <span class="logo-sm">
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.0001 0C8.9544 0 0 8.95453 0 20.0001C0 31.0458 8.9544 40 20.0001 40C31.0457 40 40 31.0458 40 20.0001C40 8.95453 31.0457 0 20.0001 0ZM23.9245 32.844H14.6473L16.6326 30.5453C19.2945 27.4642 20.4161 24.5309 19.9669 21.8273C19.3013 17.8178 15.3545 15.4678 15.3146 15.4446L14.0542 14.7173L14.8419 13.4935L19.199 6.68261C19.6126 6.03601 20.4722 5.8469 21.1189 6.26075C21.7656 6.67451 21.9546 7.53403 21.5407 8.18078L17.904 13.8659C19.4677 15.0812 22.074 17.6117 22.7047 21.3436C23.1842 24.1779 22.4384 27.1021 20.4873 30.064H23.9245C24.692 30.064 25.3146 30.6862 25.3146 31.4539C25.3146 32.2216 24.692 32.844 23.9245 32.844"
                  fill="#001C33"
                />
              </svg>
            </span>
            <span class="logo-lg">
              <img
                src="@/assets/images/logo-lg.svg"
                class="unselectable"
                alt
                width="80%"
              />
            </span>
          </div>
        </div>
        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item"
          @click="toggleMenu"
        >
          <i class="fa fa-fw fa-bars"></i>
        </button>
      </div>
      <div class="d-flex align-items-center">
        <b-dropdown right variant="black" toggle-class="header-item">
          <template v-slot:button-content>
            <div class="d-flex align-items-center">
              <b-avatar
                class="user-image mr-1"
                :text="userDetails.fullName && userDetails.fullName.charAt(0)"
                size="2.7em"
                :src="handleUserImage"
              >
              </b-avatar>
              <div class="d-none d-xl-inline-block ml-1 text-left">
                <p class="font-weight-bold mb-0">{{ userDetails.fullName }}</p>
                <span class="text-dark">{{ userDetails.email }}</span>
              </div>
              <i
                class="
                  mdi mdi-chevron-down
                  d-none d-xl-inline-block
                  font-weight-bold
                  ml-1
                  dropdown-icon
                "
              ></i>
            </div>
          </template>
          <a
            onclick="openBilling()"
            class="dropdown-item d-flex align-items-center"
          >
            <i class="bx bx-dollar font-size-16 align-middle mr-1"></i>
            Manage Billing
          </a>
          <b-dropdown-divider></b-dropdown-divider>
          <a
            @click="redirectLogin"
            class="dropdown-item text-danger d-flex align-items-center"
          >
            <i
              class="bx bx-log-in font-size-16 align-middle mr-1 text-danger"
            ></i>
            Logout
          </a>
        </b-dropdown>
      </div>
    </div>
  </header>
</template>
<style lang="scss" scoped>
#page-topbar {
  border-radius: 8px;
}
.navbar-inner,
.navbar-header {
  align-items: center;
}
.logo-lg-style {
  height: 40px;
  object-fit: contain;
  width: 140px;
}
.dropdown-icon {
  font-size: 1.4rem;
}
</style>