<script>
/**
 * Alerts component
 */
export default {
  name: 'Alert',
  components: {},
  props: {
    message: {
      type: String
    },
    type: {
      type: String,
      default() {
        return 'primary'
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      icon: null
    }
  },
  methods: {
    getIcon: () => {
      switch (this.type) {
        case 'success':
          this.icon = 'mdi-check-all';
          break;
        case 'danger':
          this.icon = 'mdi-block-helper';
          break;
        case 'warning':
          this.icon = 'mdi-alert-outline';
          break;
        case 'info':
          this.icon = 'mdi-alert-circle-outline';
          break;
        default:
          this.icon = 'mdi-bullseye-arrow';
          break;
      }
    },
    closeAlert(){
      this.$store.dispatch('notification/clear');
    }
  }
}
</script>

<template>
  <div class>
    <b-alert :show="show" dismissible @dismissed="closeAlert"  :variant="type">
      <i :class="`mdi ${icon} mr-2`"></i>{{ message }}
    </b-alert>
  </div>
</template>