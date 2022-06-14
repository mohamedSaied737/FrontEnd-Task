<template>
  <Layout>
    <!-- modals  -->
        <Modal :title="'View List Settings'" modalID="journeysColumns">
     <template>
      <ColumnsSwitcher :tableHeaders="getTableHeaders" url="journeys" modalID="journeysColumns" />
     </template>
    </Modal>
    <!-- header  -->
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between">
    <router-link 
    to=/add-journey>
  <b-button 
  pill 
   class="d-flex align-items-center px-3 top-page-btn"
   variant="primary" 
   size="sm" >
      <i class="bx bx-plus font-size-18 mr-2"></i>
        Create Journey
  </b-button>
  </router-link>
    </PageHeader> 
    <section class="journey-grid pt-3 px-2" style="background-color:white">
    <GridSettings 
    :rowsData="rowsData" 
    :onToggleVisible="onToggleVisible"
    :columns="getExportHeaders"
    :fetchTableHeaders="fetchTableHeaders"
    :limit="limit"
    :updatePageRecords='updatePageRecords'
      />
    <b-table
    :data="rowsData"
    ref="table"
    detailed
    custom-detail-row
    :default-sort="['name', 'asc']"
    detail-key="id"
    :detail-transition="transitionName"
    :show-detail-icon="showDetailIcon"
    :checkable="false"
    :striped="false"
    :narrowed="false"
    paginated
    pagination-rounded
    :per-page="limit"
    :current-page.sync="currentPage"
    >
    <template slot="empty">
        <h5 class="text-center my-2 text-muted">No matching data..</h5>
    </template>
            <!-- toggled arrow  -->
            <b-table-column
                field=""
                label=""
                width="50"
                :visible="true"
                v-slot="props"
            >
                <template >
                <div 
                class="icon-wrapper"
                :class="props.row.isCollapse?'is-expanded':''"
                >
                <i 
                v-if="props.row.journey_flows.length>1"
                class="mdi  toggle-icon mdi-chevron-right"
                @click="toggle(props.row)" ></i>
                </div>
                </template>
            </b-table-column>
            <!-- journey name  -->
            <b-table-column
                field="Journey_Name"
                label="Journey Name"
              :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Journey_Name
              : true"
                width="150"
                sortable
                searchable
            >
                     <template slot="searchable">
            <SearchInput
            :selectAction="fetchJourneys"
            :paramsKey="{
             name:'journey_name'
            }"
            />
          </template>
                <template v-slot="props">
                  <span class="no-wrap">
                    {{ sliceLongString(props.row.Journey_Name) }}
                  </span>
                </template>
            </b-table-column>
            <!-- flow name  -->
                <b-table-column
                field="Flow_Name"
                :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Flow_Name
              : true"
                label="Flow Name"
                width="100"
                searchable
                sortable
            >
          <template slot="searchable">
            <SearchInput
            :selectAction="fetchJourneys"
            :paramsKey="{
             name:'flow_name'
            }"
            />
          </template>
                <template v-slot="props">
                  {{ props.row.Flow_Name }}
                </template>
            </b-table-column>
            <!-- user type  -->
            <b-table-column
                field="User_Type"
              :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.User_Type
              : true"
                label="User Type"
                width="100"
                searchable
                sortable
            >
            <template slot="searchable">
              <SearchInput
              placeholder="filter"
              :options="getAllUsersTypes"
              label="name"
              :openAction="fetchAllUserType"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'UserType'
            }"
              type="selectInput"
            />
            </template>
                <template v-slot="props">
                    {{ props.row.User_Type }}
                </template>
            </b-table-column>
            <!-- input  -->
            <b-table-column
                field="Input"
              :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Input
              : true"
                label="Input"
                width="100"
                searchable
                sortable
            >
            <template slot="searchable">
              <SearchInput
              :options="InputTypes"
              label="name"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'Input'
            }"
              type="selectInput"
            />
            </template>
                <template v-slot="props">
                    {{ props.row.Input }}
                </template>
            </b-table-column>
            <!-- checks  -->
            <b-table-column
                field="Checks"
              :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Checks
              : true"
                label="Checks"
                width="100"
                searchable
                sortable
            >
            <template slot="searchable">
              <SearchInput
              :options="checks"
              label="name"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'Checks'
            }"
              type="selectInput"
            />
            </template>
                <template v-slot="props">
                    {{ props.row.Checks }}
                </template>   
            </b-table-column>
            <!-- compliance  -->
            <b-table-column
              field="Compliance"
              :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Compliance
              : true"
                label="Compliance"
                width="100"
                searchable
                sortable
            >
              <template slot="searchable">
              <SearchInput
              placeholder="filter"
              :options="getComplianceList"
              label="name"
              :openAction="fetchComplianceList"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'Compliance'
            }"
              type="selectInput"
            />
            </template>
                <template v-slot="props">
                   {{ props.row.Compliance }}
                </template>
            </b-table-column>
            <!-- output  -->
            <b-table-column
                field="Output"
              :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Output
              : true"
                label="Output"
                width="100"
                searchable
                sortable
            >
             <template slot="searchable">
              <SearchInput
              :options="outputs"
              label="name"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'Output'
            }"
              type="selectInput"
            />
            </template>
                <template v-slot="props">
                    {{ props.row.Output }}
                </template>  
            </b-table-column>
            <!-- notification  -->
            <b-table-column
                field="Notification"
                :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Notification
              : true"
                label="Notification"
                width="100"
                searchable
                sortable
            >
                         <template slot="searchable">
              <SearchInput
              :options="notifications"
              label="name"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'Notification'
            }"
              type="selectInput"
            />
            </template>
              <template v-slot="props">
                    {{ props.row.Notification }}
              </template> 
            </b-table-column>
            <!-- feedback  -->
            <b-table-column
                field="Feedback"
                :visible="Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Feedback
              : true"
                label="Feedback"
                searchable
                sortable
                width="100"
            >
           <template slot="searchable">
              <SearchInput
              :options="feedbacks"
              label="name"
              :selectAction="fetchJourneys"
            :paramsKey="{
             name:'Feedback'
            }"
              type="selectInput"
            />
            </template>
              <template v-slot="props">
                     {{ props.row.Feedback }}
              </template> 
            </b-table-column>
            <b-table-column
                field=""
                :visible="true"
                label=""
                v-slot="props"
                width="200"
            >
                <template>
                    <Actions :data="props.row.Data" type="journey" />
                </template>
            </b-table-column>
            <template slot="detail" slot-scope="props">
                <tr v-for="item in removeFirstElementOfArr(props.row.journey_flows)" :key="item.id">
                    
                    <td></td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Journey_Name:true">{{ props.row.Journey_Name }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Flow_Name:true" >{{ item.name }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.User_Type:true" >{{ getJourneyInputValue(item.diagram.nodes, "User Type") }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Input:true" >{{ getJourneyInputValue(item.diagram.nodes, "Input") }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Checks:true" >{{ getJourneyInputValue(item.diagram.nodes, "Checks") }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Compliance:true" >{{ getJourneyInputValue(item.diagram.nodes, "Compliance") }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Output:true" >{{ getJourneyInputValue(item.diagram.nodes, "Output") }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Notification:true" >{{ getJourneyInputValue(item.diagram.nodes, "Notifications") }}</td>
                    <td v-show="Object.keys(getTableHeaders).length > 0? getTableHeaders.Feedback:true" >{{ getJourneyInputValue(item.diagram.nodes, "Feedback") }}</td>
                    <td v-show="true" ><Actions :data="item" type="flow" /></td>
                </tr>
            </template>
    </b-table>
    </section>
  </Layout> 
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Actions from "@/components/journeyBuilder/Actions";
import { journeyColumns } from "@/utils/dataSource";
import Modal from "@/components/modal/Modal";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import GridSettings from "@/components/grid/GridSettings";
import { exportExel } from "@/utils/mixins/exportMixin";
import SearchInput from "@/components/journeyBuilder/SearchInput";
import { sliceLongString } from "@/utils/mixins/sliceLongString";

export default {
  title: "Journey Flows",
  name: "JourneysGrid",
  mixins: [exportExel,sliceLongString],
  components: {
    Layout,
    PageHeader,
    Actions,
    Modal,
    ColumnsSwitcher,
    GridSettings,
    SearchInput,
  },
  data() {
    return {
      title: "Journey / Flows",
      showDetailIcon: false,
      limit: 10,
      currentPage: 1,
      arrowCollapse: false,
      InputTypes: [
        { id: "facial_recognition", name: "Facial Recognition" },
        { id: "rfid", name: "RFID" },
        { id: "qr_code", name: "QR Code" },
      ],
      outputs: [
        { id: "door_relay", name: "Door relay" },
        { id: "print_badge", name: "Print badge" },
        { id: "save_data", name: "Save data" },
      ],
      checks: [
        { id: "temperature_check", name: "Temperature" },
        { id: "mask_check", name: "Mask" },
      ],
      feedbacks: [
        { id: "audio_feedback", name: "Audio" },
        { id: "temperature_feedback", name: "Temperature" },
        { id: "light_feedback", name: "Light" },
      ],
      notifications: [
        { id: "temperature_alert", name: "Temperature Alert" },
        { id: "mask_alert", name: "Mask Alert" },
        { id: "compliance_alert", name: "Compliance Alert" },
      ],
    };
  },
  computed: {
    ...mapGetters("journeyBuilder", ["getJourneys"]),
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders"]),
    ...mapGetters("userType", ["getAllUsersTypes"]),
    ...mapGetters("compliance", ["getComplianceList"]),

    rowsData() {
      let journeys = JSON.parse(JSON.stringify(this.getJourneys));
      return journeys && journeys.length > 0
        ? journeys.map((item) => {
            const inputValue = this.getJourneyInputValue;
            return {
              isCollapse: false,
              id: item.id,
              Journey_Name: item.name,
              Flow_Name:
                item.journey_flows && item.journey_flows.length > 0
                  ? item.journey_flows[0].name
                  : "-",
              User_Type:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(item.journey_flows[0].diagram.nodes, "User Type")
                  : "-",
              Input:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(item.journey_flows[0].diagram.nodes, "Input")
                  : "-",
              Checks:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(item.journey_flows[0].diagram.nodes, "Checks")
                  : "-",
              Compliance:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(
                      item.journey_flows[0].diagram.nodes,
                      "Compliance"
                    )
                  : "-",
              Output:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(item.journey_flows[0].diagram.nodes, "Output")
                  : "-",
              Notification:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(
                      item.journey_flows[0].diagram.nodes,
                      "Notifications"
                    )
                  : "-",
              Feedback:
                item.journey_flows &&
                item.journey_flows.length > 0 &&
                item.journey_flows[0].diagram
                  ? inputValue(item.journey_flows[0].diagram.nodes, "Feedback")
                  : "-",
              journey_flows: item.journey_flows,
              Data: item,
            };
          })
        : [];
    },
    transitionName() {
      return "fade-in";
    },
  },
  methods: {
    ...mapActions("journeyBuilder", ["fetchJourneys"]),
    ...mapActions("journey", ["deleteJourney"]),
    ...mapActions("journeyFlow", ["deletejourneyFlow"]),
    ...mapActions("userType", ["fetchAllUserType"]),
    ...mapActions("compliance", ["fetchComplianceList"]),
    ...mapActions("grid", [
      "onTableHeader",
      "updateTableHeaders",
      "resetTableHeaders",
      "resetFilterValues",
      "onSetFilterValue",
    ]),
    toggle(row) {
      row.isCollapse = !row.isCollapse;
      this.$refs.table.toggleDetails(row);
    },
    onToggleVisible() {
      this.$bvModal.show("journeysColumns");
    },
    getJourneyInputValue(arr, inputValue) {
      const node =
        arr && arr.length > 0
          ? arr.filter((input) => {
              if (input.type == inputValue) {
                return input.label;
              }
            })
          : [];
      return node.length > 0 ? node[0].label : "-";
    },
    removeFirstElementOfArr(arr) {
      return arr.slice(1);
    },
    journeyType(id, type) {
      switch (type) {
        case "journey":
          this.deleteJourney(id);
          break;
        case "flow":
          this.deletejourneyFlow(id);
          break;
        default:
          "";
          break;
      }
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/journeys",
        headers: journeyColumns,
      });
    },
    updatePageRecords(value){
      this.limit = value
    }
  },
  mounted() {
    this.fetchTableHeaders();
    this.fetchJourneys();
  },
};
</script>

<style lang="scss" scoped>
.journey-grid {
  .toggle-icon {
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }
  .icon-warpper {
    display: flex;
    justify-content: center;
    height: 1.5rem;
    width: 1.5rem;
  }
  .is-expanded {
    transform: rotate(90deg);
    transition: transform 150ms ease-out, opacity 86ms ease-out,
      -webkit-transform 150ms ease-out;
  }
}
</style>