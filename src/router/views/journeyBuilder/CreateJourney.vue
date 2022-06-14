<template>
  <Layout>
    <div class="journey" v-if="(currentRoute == addJourney || currentRoute == updateJourney)">
      <SubmitJourney />
    </div>
    <div class="flow" v-if="(currentRoute == addFlow || currentRoute == addJourneyFlow || currentRoute == updateFlow)">
    <section class="journey-form-wrapper"> 
      <SubmitBuilder />
    </section>
    </div>
  </Layout>
</template>

<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import Collapsible from "vue-collapsible-component";
import "vue-light-flowchart/dist/vue-light-flowchart.css";
import SubmitJourney from "@/components/journeyBuilder/SubmitJourney";
import SubmitBuilder from "@/components/journeyBuilder/SubmitBuilder";

export default {
  title: "Journey",
  components: {
    Layout,
    Collapsible,
    SubmitJourney,
    SubmitBuilder,
  },
  data() {
    return {
      addJourney:'addJourney',
      updateJourney:'updateJourney',
      addFlow:'addFlow',
      addJourneyFlow:'addJourneyFlow',
      updateFlow:'updateFlow',
    };
  },

  beforeMount(){
  this.currentRoute = this.$route.name; 
  },


};
</script>

<style lang="scss" scobed>
.journey-form-wrapper {
  padding: 2% 1%;
  background-color: #fff;
  border-radius: 10px;
  margin: 0 auto;
  border: 1px solid #dddbda;
  max-height: 100%;
  min-height: 400px;
}
.text {
  white-space: nowrap;
  width: 90px;
}
.btn {
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
