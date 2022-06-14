import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css'; // dx.light.css
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Vuelidate from "vuelidate";
import VueRouter from "vue-router";
import router from "./router/index";
import Scrollspy from "vue2-scrollspy";
import store from "@/state/store";
import App from "./App.vue";
import i18n from "./i18n";
import { Table, Datepicker, Tabs, Slider } from 'buefy';
import JsonExcel from "vue-json-excel";
import Toast from "vue-toastification";
import moment from 'vue-moment';
import momentTimezone from 'moment-timezone'
import Collapsible from 'vue-collapsible-component';
import BootstrapVueTreeview from 'bootstrap-vue-treeview'
import VueTextareaAutosize from 'vue-textarea-autosize'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import ImageUploader from 'vue-image-upload-resize';
import titleMixin from './utils/mixins/titleMixin';
import DatePicker from "vue2-datepicker";
import Multiselect from "vue-multiselect";

// socket.io
import VueSocketio from 'vue-socket.io';

Vue.use(new VueSocketio({
  // debug: true,
  connection: process.env.VUE_APP_GRID_SYNC_URL,
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
})
);

// import the styles
import 'vue-collapsible-component/lib/vue-collapsible.css';
import "vue-toastification/dist/index.css";
import "@/design/index.scss";

Vue.use(VueRouter);
Vue.use(Scrollspy);
const VueScrollTo = require("vue-scrollto");
Vue.use(VueScrollTo);
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Toast);
Vue.use(moment, {
  momentTimezone
});
Vue.use(Collapsible);
Vue.use(BootstrapVueTreeview);
// buefy components
Vue.use(Table);
Vue.use(Datepicker);
Vue.use(DatePicker);
Vue.component('multiselect', Multiselect);
Vue.use(Tabs);
Vue.use(Slider);
Vue.use(Vuelidate);
Vue.use(require("vue-chartist"));
Vue.use(VueTextareaAutosize);
Vue.use(ImageUploader);
Vue.component("downloadExcel", JsonExcel);
Vue.component('VueQrcode', VueQrcode);
Vue.mixin(titleMixin);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
