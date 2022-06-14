<script>
import { layoutComputed } from "@/state/helpers";
import NavBar from "@/components/nav-bar";
// import Footer from "@/components/footer";
/**
 * Vertical layout
 */
export default {
  components: { NavBar },
  data() {
    return {
      isMenuCondensed: false,
    };
  },
  computed: {
    ...layoutComputed,
  },
  created: () => {
    document.body.removeAttribute("data-layout", "horizontal");
    document.body.removeAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-layout-size", "boxed");
  },
  mounted() {
    if (this.loader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  },
};
</script>

<template>
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner-chase">
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
        </div>
      </div>
    </div>
    <div id="layout-wrapper">
      <NavBar />
      <!-- <SideBar :is-condensed="isMenuCondensed" :type="leftSidebarType" :width="layoutWidth" /> -->
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->
      <div class="main-content-entity">
        <div class="page-content">
          <!-- Start Content-->
          <div class="container-fluid">
            <slot />
          </div>
        </div>
        <!-- <Footer /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-fluid{
  min-height: 500px;
}
</style>
