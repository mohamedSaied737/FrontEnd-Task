<script>
import { mapActions, mapGetters } from "vuex";
import ActionCell from "@/components/userTypes/ActionCell";
export default {
  components: {
    ActionCell,
  },
  name: "UserTypeChildern",
  props: ["gridData"],
  data() {
    return {
      title: "User Types",
      showDetailIcon: true,
      checkedRows: [],
    };
  },
  watch: {
    checkedRows(rows) {
      this.onSelectedRows(rows);
    },
  },
  computed: {
    ...mapGetters("grid", ["getTableHeaders", "getSelectedRows", "getLoading"]),
    rowsData() {
      return this.gridData && this.gridData.length > 0
        ? this.gridData.map((item) => {
            return {
              id: item.id,
              Name: item.name,
              Parent: item.parent ? item.parent.name : "--",
              FaceRetention:
                item.settings && item.settings.length > 0
                  ? item.settings[0].pivot.value
                  : "-",
              DataRetention:
                item.settings && item.settings.length > 0
                  ? item.settings[1].pivot.value
                  : "-",
              parentId: item.parent_id,
              Data: item,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("userType", ["fetchUserTypeList"]),
    ...mapActions("grid", ["onSelectedRows"]),
    ...mapActions("modal", ["onResetModal"]),
  },
};
</script>
<template >
  <section class="user-types-children-grid-wrapper" >
    <b-table
      :data="rowsData"
      ref="table"
      :mobile-cards="false"
      :default-sort="['name', 'asc']"
      :loading="getLoading"
      checkable
      :header-checkable="false"
      :row-class="(row, index) => 'hide-arrow-icon-detail'"
      :checked-rows.sync="checkedRows"
    >
      <!-- name -->
      <b-table-column 
        :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Name : true
        "
        field="Name"
        label="Name"
      >
        <template slot="searchable" slot-scope="props" >
          <b-input
            v-model="props.filters[props.column.field]"
            placeholder="Search..."
            size="sm"
          />
        </template>
        <template v-slot="props">
          {{ props.row.Name }}
        </template>
      </b-table-column>
      <!-- face retention -->
      <!-- <b-table-column
        :visible="
         Object.keys(getTableHeaders).length > 0
         ? getTableHeaders.FaceRetention
         : true
          "
          field="FaceRetention"
          label="Face Retention"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.FaceRetention }}
          </template>
        </b-table-column> -->
      <!-- data retention  -->
      <!-- <b-table-column
          :visible="
           Object.keys(getTableHeaders).length > 0? getTableHeaders.DataRetention: true"
          field="DataRetention"
          label="Data Retention"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.DataRetention }}
          </template>
        </b-table-column> -->
      <!-- actions  -->
      <b-table-column field="Actions" label="Actions" >
        <!-- multiple actions  -->
        <template v-slot:header="{ column }" >
          <span v-if="getSelectedRows.length <= 1">{{ column.label }} </span>
          <ActionCell :data="getSelectedRows" type="multiSelection" v-else />
        </template>
        <!-- single action  -->
        <template v-slot="props" >
          <ActionCell :data="props.row.Data" />
        </template>
      </b-table-column>
    </b-table>
  </section>
</template>

<style lang="scss">
.user-types-children-grid-wrapper {
  .b-table{
    overflow: visible;
  }
  .table-wrapper {
    background-color: #f7f7fa;
    overflow: visible;
    min-height: 0;
  }
  .table thead {
    display: none;
  }
  .table thead tr,
  tbody tr td {
    width: 400px;
  }
  .table tbody tr {
    background-color: #f7f7fa;
  }
}
</style>
