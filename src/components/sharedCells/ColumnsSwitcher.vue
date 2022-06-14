<template>
  <div class="switchers-wrapper">
    <div class="row" v-if="columns">
      <div class="row mb-4 ml-4">
        <b-form-checkbox switch v-model="selectAll" size="lg">
          <span class="h6">Select All</span>
        </b-form-checkbox>
      </div>
      <b-form-group>
        <b-form-checkbox-group v-model="selected" size="lg" switches>
          <b-form-checkbox
            class="col-3 mb-3 ml-4"
            v-for="(col, colName, i) in columns"
            :value="colName"
            :key="i"
          >
            <span class="h6">{{ colName == 'VaccineDocument' ? 'Vaccine/PCR' : colName }}</span>
          </b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
    </div>
    <!-- submit -->
    <div class="d-flex justify-content-end border-top px-3 pt-3">
      <div class="btn-wrapper d-flex align-items-center">
        <b-button
          class="mx-2"
          variant="outline-secondary"
          @click.stop="closeModal"
          >Cancel</b-button
        >
        <b-button
          class="submit-btn px-4"
          variant="primary"
          @click="onUpdateTableHeaders"
          >Confirm</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ColumnsSwitcher",
  props: ["tableHeaders", "url", "modalID", "fetchTableHeaders", "hasDocuments", "grid", "vaccineColumn"],
  data() {
    return {
      selectAll: false,
      selected: [],
      columns: null,
      updatedHeaders: {},
    };
  },
  computed: {
    ...mapGetters("grid", ["getTableHeaders"]),
    getHeadersLength() {
      return Object.keys(this.getTableHeaders).length == this.selected.length;
    },
  },
  watch: {
    selected(headers) {
      Object.keys(this.getTableHeaders).length == headers.length &&
        (this.selectAll = true);
      for (let prop in this.columns) {
        {
          this.updatedHeaders[prop] =
            headers.length > 0 && headers.includes(prop) ? true : false;
        }
      }
    },
    selectAll(value) {
      value
        ? (this.selected = Object.keys(this.columns))
        : (this.selected = []);
    },

    columns(columns){
      const {hasDocuments,grid,vaccineColumn} = this;
      if((hasDocuments && hasDocuments.length == 0) && (grid && grid == 'users' && (vaccineColumn&&!vaccineColumn.userDocument) )){
        delete columns.VaccineDocument 
      }
      if((grid && grid == 'history' || grid && grid == 'dashboard') && (vaccineColumn&&!vaccineColumn.scanDocument) ){
        delete columns.VaccineDocument 
      }
    }
  },
  methods: {
    ...mapActions("grid", ["updateTableHeaders"]),
    updateSwitcherValues() {
      for (let prop in this.columns) {
        this.columns[prop] && this.selected.push(prop);
      }
      return this.selected;
    },
    closeModal() {
      this.$bvModal.hide(this.modalID);
    },
    onUpdateTableHeaders() {
      this.updateTableHeaders({
        url: this.url,
        headers: this.updatedHeaders,
      });
      this.$bvModal.hide(this.modalID);
    },
  },
  mounted() {
    this.columns = this.getTableHeaders;
    this.updateSwitcherValues();
  },
};
</script>
