import { mapGetters } from "vuex";

export const exportExel = {
  computed: {
    ...mapGetters("grid", ["getTableHeaders"]),
    ...mapGetters("compliance", ["getComplianceList"]),
    getExportHeaders() {
      let obj = this.getTableHeaders; // table headers
      let headers = Object.keys(obj); // get keys
      let filteredHeaders = headers.filter((key) => obj[key]); // get arr of true values
      let convertedHeaders = this.convertArrtoObject(filteredHeaders); // convert arr to obj
      ["Compliances","VaccineDocument"].forEach((e) => delete convertedHeaders[e]); // reomve unexported columns
      (this.$route.path != "/compliances" && this.getComplianceList) && this.getComplianceList.length > 0 // add compliance data to exported files
        ? this.getComplianceList.map((compliance) => {
            if (
              compliance.type == "agreement" ||
              compliance.type == "questionnaire"
            ) {
                convertedHeaders[compliance.name] = compliance.name;
            }
          })
        : [];
      return convertedHeaders;
    },
  },
  methods: {
    convertArrtoObject(arr) {
      let obj = {};
      for (let i = 0; i < arr.length; ++i) {
        obj[arr[i]] = arr[i];
      }
      return obj;
    },
  },
};
