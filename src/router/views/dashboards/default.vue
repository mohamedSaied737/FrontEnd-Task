<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import { getVisipointClient } from "../../../helpers/visipoint-client";
import Stat from "@/components/widgets/stat";
import Scans from "@/components/widgets/scans";

export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Stat,
    Scans,
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      const self = this;
      const client = getVisipointClient();
      client.get("/api/dashboard").then((data) => {
        self.statData = [
          {
            icon: "mdi mdi-login-variant",
            title: "Signed In",
            value: data.data.totals.daily.signed_in,
          },
          {
            icon: "mdi mdi-logout-variant",
            title: "Signed Out",
            value: data.data.totals.daily.signed_out,
          },
          {
            icon: "mdi mdi-account-question",
            title: "Expected",
            value: data.data.totals.daily.expected,
          },
          {
            icon: "mdi mdi-account-clock-outline",
            title: "Signed In Visitors",
            value: 0,
          },
          {
            icon: "mdi mdi-account-hard-hat",
            title: "Failed Temperature Checks",
            value: data.data.totals.daily.temperature.failed,
          },
        ];
      });

      client
        .get("/api/scans")
        // eslint-disable-next-line no-console
        .then((data) => (self.scanData = data));
    },
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Default",
          active: true,
        },
      ],
      statData: [],
      scanData: [],
    };
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <!-- end col -->
      <div class="col-xl-12">
        <div class="row">
          <div v-for="stat of statData" :key="stat.icon" class="col-md-4">
            <Stat :icon="stat.icon" :title="stat.title" :value="stat.value" />
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Latest Visitors</h4>
            <!-- Transactions table -->
            <Scans :row-data="scanData" />
          </div>
        </div>
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>
