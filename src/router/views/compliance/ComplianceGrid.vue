<template>
  <Layout>
    <!-- header -->
    <PageHeader
      :title="title"
      :items="items"
      className="d-flex align-items-center justify-content-between"
    >
      <router-link to="/compliance-new">
        <b-button
          pill
          class="d-flex align-items-center px-3 top-page-btn"
          variant="primary"
          size="sm"
          type="submit"
        >
          <i class="bx bx-plus font-size-18 mr-2"></i>
          Create Compliance
        </b-button>
      </router-link>
    </PageHeader>
    <!-- columns view -->
    <Modal :title="'View List Settings'" modalID="compliances">
      <template>
        <ColumnsSwitcher
          :tableHeaders="getTableHeaders"
          url="/compliances"
          modalID="compliances"
          :fetchTableHeaders="fetchTableHeaders"
        />
      </template>
    </Modal>
    <section id="complianceGrid">
      <!-- Grid Start-->
      <DataTable
        :rows="rowsData"
        :getDataAction="''"
        :loading="getLoading"
        :columns="getExportHeaders"
        xlsxName="compliance-xlsx"
        :hasBEpagination="false"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :gridSettings="true"
        :iconAction="onToggleVisible"
        :isSelectable="onRowClicked"
      >
        <!-- checkbox -->
        <b-table-column
          label=""
          v-slot="props"
          header-class="header-class"
          width="50"
          :visible="hideAll"
        >
          <b-form-checkbox
            @change="onCheck(props.row.id, $event)"
            class="arrowIconToggle"
            v-model="props.row.showDetails"
          />
        </b-table-column>
        <!-- Compliance -->
        <b-table-column
          field="name"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.name
              : true
          "
          label="Compliance"
          width="220"
          header-class="header-class"
          sortable
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props" class="flex-column">
            <p class="cell-text">{{ props.row.name }}</p>
            <!-- Compliance details -->
            <div v-if="props.row.showDetails" class="answers-wrapper">
              <span class="mb-1 text-muted">{{
                props.row.detail_list &&
                  props.row.detail_list.length > 0 &&
                  props.row.detail_list[0].type=='vaccine_document'?'Document - Vaccine/PCR':props.row.detail_list[0].type
              }}</span>
              <div
                class="row-details mb-1"
                v-for="(question, i) in props.row.detail_list"
                :key="i"
              >
                <textarea-autosize
                v-if="question.body"
                class="text-muted border"
                placeholder="Type something here..."
                ref="myTextarea"
                :value="question.body"
                :min-height="30"
                :max-height="350"
                 style="background-color: transparent;border: 0;padding: 0;font-size: 0.8rem;resize: none;"
               />
               <div class="mb-1" v-else>
               <p class="mb-0 text-capitalize text-muted">Document Binding : {{question.bind}}</p>
               <p v-if="question.pcr" class="mb-0 text-capitalize text-muted">PCR Validation Days : {{question.pcr.days }}</p>
               </div>
                <b-form-checkbox
                  size="sm"
                  class="comp-checkbox"
                  v-for="answer in question.answers"
                  :key="answer.id"
                  v-model="answer.desired"
                  plain
                  disabled
                >
                  {{ answer.text ? answer.text : "--" }}
                </b-form-checkbox>
              </div>
            </div>
          </template>
        </b-table-column>
        <!-- Version -->
        <b-table-column
          field="version"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.version
              : true
          "
          label="Version"
          width="100"
          header-class="header-class"
          sortable
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props" class="flex-column">
            <p class="cell-text">
              {{ props.row.version ? props.row.version : "--" }}
            </p>
          </template>
        </b-table-column>
        <!-- Date created -->
        <b-table-column
          field="date"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.date
              : true
          "
          label="Date"
          width="150"
          header-class="header-class"
          sortable
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <date-picker
              v-model="props.filters[props.column.field]"
              type="date"
              value-type="format"
              format="YYYY-MM-DD"
              placeholder="Filter"
              :show-time-panel="showTimePanel"
              @close="handleOpenChange"
            >

            </date-picker>
          </template>
          <template v-slot="props" class="flex-column">
            <p class="cell-text">
              {{ props.row.date ? props.row.date : "--" }}
            </p>
          </template>
        </b-table-column>
        <!-- Actions -->
        <b-table-column
          label="Actions"
          v-slot="props"
          width="150"
          header-class="header-class"
          centered
          :visible="hideAll"
        >
          <div class="flex-column">
            <ComplianceActionRenderer :data="props" />
          </div>
        </b-table-column>
      </DataTable>
      <!-- Grid End -->
    </section>
  </Layout>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import DataTable from "@/components/grid/DataTable";
import PageHeader from "@/components/page-header";
import ComplianceActionRenderer from "./ComplianceActionsRenderer";
import { complianceColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import Modal from "@/components/modal/Modal";
import DatePicker from "vue2-datepicker";
import {exportExel} from '@/utils/mixins/exportMixin';

export default {
  title: "Compliance",
  mixins:[exportExel],
  components: {
    Layout,
    DataTable,
    PageHeader,
    ComplianceActionRenderer,
    ColumnsSwitcher,
    Modal,
    DatePicker,
  },
  data: function() {
    return {
      showTimePanel: false,
      title: "Compliance List",
      items: [
        {
          text: "Compliance",
          href: "/compliance",
        },
        {
          text: "List",
          active: true,
        },
      ],
      complianceColumns:complianceColumns,
      hideArrow:false
    };
  },
  computed: {
    ...mapGetters("compliance", ["getComplianceList"]),
    ...mapGetters("grid", ["getSelectedRows", "getLoading", "getTableHeaders"]),
    rowsData() {
      return this.getComplianceList && this.getComplianceList.length > 0
        ? this.getComplianceList.map(el => {
            return {
              name: el.name,
              version: el.version_id,
              date: el.created_at,
              id: el.id,
              detail_list:  el.form_metadata.questions ? el.form_metadata.questions : el.form_metadata.data,
              showDetails: false,
            };
          })
        : [];
    },
    hideAll(){
      return !Object.values(this.getTableHeaders).every((v) => v === false)
    }
  },
  watch: {
    getComplianceList: function() {
      document.querySelectorAll(".arrowIconToggle").forEach((el) => {
        el.parentElement.parentElement.classList.remove("selected-row");
        this.rowsData.map((el) => (el.showDetails = false));
      });
    },
  },
  methods: {
    ...mapActions("compliance", ["fetchComplianceList"]),
    ...mapActions("grid", [
      "onTableHeader",
      "resetTableHeaders",
      "resetFilterValues",
    ]),
    onCheck(id, event) {
      let checkedIndex = this.rowsData.map((item) => item.id).indexOf(id);
      this.rowsData[checkedIndex].showDetails = event;
      document.querySelectorAll(".arrowIconToggle").forEach((el) => {
        el.childNodes[0].checked
          ? el.parentElement.parentElement.classList.add("selected-row")
          : el.parentElement.parentElement.classList.remove("selected-row");
      });
    },
    onRowClicked() {
      return "";
    },
    onToggleVisible() {
      this.$bvModal.show("compliances");
    },
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleOpenChange() {
      this.showTimePanel = false;
    },
    handleRangeClose() {
      this.showTimeRangePanel = false;
    },
    fetchTableHeaders(){
      this.onTableHeader({
      url: "/compliance",
      headers: complianceColumns,
    });
    }
  },
  mounted() {
    this.fetchTableHeaders();
    this.fetchComplianceList();
  },
  destroyed() {
    this.resetTableHeaders();
    this.resetFilterValues();
  },
};
</script>

<style lang="scss">
#complianceGrid {
  font-style: normal;
  margin-top: 15px;
  .table-wrapper {
    overflow-y: hidden !important;
  }
  .description-form input {
    width: 100%;
    padding-left: 8px;
  }
  .selected-row {
    transition: all 0.4s ease;
    background-color: rgba(243, 243, 243, 0.6) !important;
    border: 1px solid rgba(0, 0, 0, 1) !important;
  }
  .answers-wrapper {
    .row-details {
      border: 1px solid rgb(235, 229, 229);
      border-top: none;
      border-radius: 10px;
      padding: 1% 3%;
    }
  }
  .answers-list {
    list-style: circle;
  }
  .arrowIconToggle {
    input {
      display: none !important;
    }
    .custom-checkbox .custom-control-input {
      background-color: #fff;
    }
    label.custom-control-label::before {
      border: none !important;
      background-color: transparent;
    }
    .custom-control-input {
      &:checked + .custom-control-label::after {
        transition: all 0.3s ease;
        transform: rotate(0deg) !important;
      }
    }
    .custom-control-label::after {
      transition: all 0.3s ease;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background-size: 0.9em;
      @media only screen and (min-width: 670px) {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
