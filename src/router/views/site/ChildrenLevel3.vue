<template>
  <section class="area-children-grid-wrapper">
    <b-table
      :data="rowsData"
      ref="table"
      :mobile-cards="false"
      detailed
      :default-sort="['name', 'asc']"
      detail-key="id"
      :show-detail-icon="showDetailIcon"
      :row-class="
        (row, index) =>
          row.Children.length > 0 || row.Kiosk.length > 1
            ? ''
            : 'hide-arrow-icon-detail'
      "
      :header-checkable="false"
    >
      <!-- name  -->
      <b-table-column
        field="Area_Name"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Area_Name
            : true
        "
        label="Child Area"
      >
        <template slot="searchable" slot-scope="props">
          <b-input
            v-model="props.filters[props.column.field]"
            placeholder="Search..."
            size="sm"
          />
        </template>
        <template v-if="showDetailIcon" v-slot="props">
          <span class="no-wrap">{{ props.row.Area_Name }}</span>
        </template>
      </b-table-column>
      <!-- Login mode  -->
      <b-table-column
        field="Login Mode"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Login_Mode
            : true
        "
        label="Login Mode"
        width="200"
      >
        <template v-slot="props">
          <span class="no-wrap text-capitalize">
          {{  props.row.Login_Mode }}</span>
        </template>
      </b-table-column>
      <!-- kiosk name  -->
      <b-table-column
        field="Kiosk_Name"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Kiosk_Name
            : true
        "
        label="Kiosk Name"
      >
        <template slot="searchable" slot-scope="props">
          <b-input
            v-model="props.filters[props.column.field]"
            placeholder="Search..."
            size="sm"
          />
        </template>
        <template v-if="showDetailIcon" v-slot="props">
          <span class="no-wrap">{{ props.row.Kiosk_Name }}</span>
        </template>
      </b-table-column>
      <!-- journey name  -->
      <b-table-column
        field="Journey"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Journey
            : true
        "
        label="Journey"
        width="300"
      >
        <template v-slot="props">
          <span class="no-wrap">{{ props.row.Journey }}</span>
        </template>
      </b-table-column>
      <!-- android serial  -->
      <b-table-column
        field="Android_Serial"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Android_Serial
            : true
        "
        label="Android Serial"
        v-slot="props"
      >
        <span class="no-wrap">{{ props.row.Android_Serial }}</span>
      </b-table-column>
      <!-- lamasatech_serial  -->
      <b-table-column
        header-class="no-wrap"
        field="Lamasatech_Serial"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Lamasatech_Serial
            : true
        "
        label="LamasaTech Serial"
        v-slot="props"
      >
        <span class="no-wrap">{{ props.row.Lamasatech_Serial }}</span>
      </b-table-column>
      <!-- mac_address  -->
      <b-table-column
        field="Mac_Address"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Mac_Address
            : true
        "
        label="Mac Address"
        v-slot="props"
      >
        <span class="no-wrap">{{ props.row.Mac_Address }}</span>
      </b-table-column>
      <!-- status  -->
      <b-table-column
        field="Status"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Status
            : true
        "
        label="Status"
      >
        <template v-slot="props">
          <span v-if="props.row.Status == 'Multiple'">{{
            props.row.Status
          }}</span>
          <span v-if="!props.row.Status" class="text-warning no-wrap"
            >Not Synced</span
          >
          <span
            v-if="props.row.Status && props.row.Status == 1"
            class="text-green no-wrap"
            >Online</span
          >
          <span
            v-if="props.row.Status && props.row.Status == 0"
            class="text-red no-wrap"
            >Off-line since {{ props.row.LastSync }}</span
          >
        </template>
      </b-table-column>
      <!-- Pre_Registration_URL  -->
          <!-- <b-table-column
            field="Pre_Registration_URL"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Mac_Address
                : true
            "
            label="Pre-registration URL"
            width="200"
          >
            <template v-slot="props">
              <router-link
                v-if="
                  props.row.Pre_Registration_URL &&
                  props.row.Pre_Registration_URL !== '-'
                "
                :to="`/${pre_reg_url}/${props.row.Pre_Registration_URL}`"
                target="_blank"
                class="area-register-url"
              >
                {{
                  `${domain_env}/${pre_reg_url}/${props.row.Pre_Registration_URL}`
                }}
              </router-link>
            </template>
          </b-table-column> -->
      <!-- area actions  -->
      <b-table-column
        field="Actions"
        :visible="true"
        label="Area Settings"
        v-slot="props"
      >
        <Actions :data="props.row.Area" type="area" />
      </b-table-column>
      <!-- Kiosk actions  -->
      <b-table-column
        field="Actions"
        :visible="true"
        label="Kiosk Settings"
        v-slot="props"
      >
        <Actions
          :data="props.row.Kiosk[0]"
          type="kiosk"
          v-if="
            props.row.Kiosk.length > 0 && props.row.Kiosk_Name != 'Multiple'
          "
        />
      </b-table-column>
      <!-- details     -->
      <template #detail="props">
        <KioskGrid
          v-if="props.row.Kiosk.length > 1"
          :kiosks="props.row.Kiosk"
          :journey="props.row.Journey"
        />
      </template>
    </b-table>
  </section>
</template>

<script>
import Actions from "@/components/sites/Actions";
import KioskGrid from "./KioskGrid";
import {maxLength,} from "vuelidate/lib/validators";
import { mapActions } from "vuex";

export default {
  name: "AreaGrid",
  props: ["areaData", "getTableHeaders"],
  components: { Actions, KioskGrid },
  data() {
    return {
      showDetailIcon: true,
      domain_env:process.env.VUE_APP_DOMAIN,
      pre_reg_url: process.env.VUE_APP_PRE_REGISTRATION_URL,
    };
  },
  validations:{
    Area_Name:{
      maxLength: maxLength(20),
      },
    Area_Description:{
      maxLength: maxLength(255),
    },
  },
  computed: {
    rowsData() {
      return this.areaData && this.areaData.length > 0
        ? this.areaData.map((area) => {
            return {
              id: area.id,
              Area_Name: area.name,
              Login_Mode:
                area.loginMode
                  ?  area.loginMode
                  : "-" ,
              Kiosk_Name:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.name).length > 1
                    ? "Multiple"
                    : area.kiosk.map((kiosk) => kiosk.name).toString()
                  : "-",
              Android_Serial:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.android_serial).length > 1
                    ? "Multiple"
                    : area.kiosk.map((kiosk) => kiosk.android_serial).toString()
                  : "-",
              Lamasatech_Serial:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.lamasatech_serial).length >
                    1
                    ? "Multiple"
                    : area.kiosk
                        .map((kiosk) => kiosk.lamasatech_serial)
                        .toString()
                  : "-",
              Mac_Address:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.mac_address).length > 1
                    ? "Multiple"
                    : area.kiosk.map((kiosk) => kiosk.mac_address).toString()
                  : "-",
              Children: area.children ? area.children : [],
              Kiosk: area.kiosk,
              Area: area,
              Journey: area.journey ? area.journey.name : "-",
              Pre_Registration_URL:area.pre_registration_url?area.pre_registration_url:'-',
              LastSync:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.kiosk_sync_infs.last_sync)
                      .length > 1
                    ? "Multiple"
                    : area.kiosk
                        .map((kiosk) => kiosk.kiosk_sync_infs.last_sync)
                        .toString()
                  : "-",
            };
          })
        : [];
    },
  },
  methods:{
    ...mapActions("userType", ["fetchRegistrationTypes"]),
      onPreRegisterUrl(id){
      this.fetchRegistrationTypes(id)
    },
    ...mapActions("modal", ["setData"]),
    setActionData(areaIndex) {
      this.setData({
        kiosk: this.areaData[areaIndex].kiosk[0]
      });
    },
  }
};
</script>

