<template>
  <Layout>
    <b-modal id="entityForm" hide-footer hide-header size="md" scrollable>
      <EntityForm />
    </b-modal>
    <b-modal id="editEntity" hide-footer hide-header size="md" scrollable>
      <EditEntity />
    </b-modal>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between mb-3"
    >
      <b-button
        pill
        class="d-flex align-items-center px-3 no-wrap top-page-btn"
        variant="primary"
        v-b-modal="'entityForm'"
        @click="setData({})"
        size="sm"
      >
        <i class="bx bx-plus font-size-18 mr-2"></i>
        Create Company
      </b-button>
    </PageHeader>
    <!-- grid  -->
    <section class="table-wrapper">
      <DataTable
        class="my-2"
        :rows="rowsData"
        :columns="columns"
        getDataAction=""
        :loading="getLoading"
        :hasCheckbox="false"
        :hasBEpagination="true"
        :hasBEfiltering="false"
        :hasBEsorting="true"
        :hasDetails="false"
        :gridSettings="true"
        :isSelectable="onRowClicked"
        :selectable="true"
        :displayTempretureSettings="false"
        :isHoverable="true"
      >
        <!-- name -->
        <b-table-column field="name" :visible="true" label="Name" searchable>
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <span class="text-primary text-uppercase">
              {{ props.row.name }}
            </span>
          </template>
        </b-table-column>
        <!-- subdomain -->
        <b-table-column
          field="subdomain"
          :visible="true"
          label="Subdomain"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.subdomain }}
          </template>
        </b-table-column>
        <!-- package -->
        <b-table-column
          field="package"
          label="Package"
          sortable
          :visible="true"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.package }}
          </template>
        </b-table-column>
        <!-- kiosk -->
        <b-table-column
          field="kiosk"
          :visible="true"
          label="Kiosk"
          sortable
          v-slot="props"
        >
          {{ props.row.kiosk }}
        </b-table-column>
        <!-- actions  -->
        <b-table-column field="Actions" :visible="true" label="" v-slot="props">
          <b-button
            variant="outline-primary"
            pill
            class="submit-btn text-center px-3 no-wrap"
            size="sm"
            v-b-modal="'editEntity'"
            @click.stop="setData(props.row.entityData)"
          >
            Edit
          </b-button>
        </b-table-column>
      </DataTable>
    </section>
  </Layout>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/entity";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/grid/DataTable";
import { exportExel } from "@/utils/mixins/exportMixin";
import EntityForm from "@/components/entity/EntityForm";
import EditEntity from "@/components/entity/EditEntity";

export default {
  title: "Companies",
  name: "CompaniesGrid",
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    DataTable,
    EntityForm,
    EditEntity,
  },
  data() {
    return {
      title: "List Of Companies",
      columns: {
        name: "Name",
        subdomain: "Subdomain",
        package: "Package",
        kiosk: "Kiosk",
      },
    };
  },
  computed: {
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders", "getLoading"]),
    ...mapGetters("authfack", ["userDetails", "userEntities", "loadingStatus"]),
    ...mapGetters("entity", ["getEntities"]),
    rowsData() {
      const { getEntities } = this;
      return getEntities && getEntities.length > 0
        ? getEntities.map((company) => {
            return {
              name: company.name,
              subdomain: company.subdomain,
              package: company.package,
              kiosk: company.kiosks,
              entityData: company,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("authfack", ["setCurrentEntity"]),
    ...mapActions("entity", ["fetchEntities"]),
    ...mapActions("modal", ["setData"]),
    ...mapActions("grid", [
      "onTableHeader",
      "resetTableHeaders",
      "resetFilterValues",
    ]),
    onToggleVisible() {
      this.$bvModal.show("companies");
    },
    onRowClicked(entity) {
      this.setCurrentEntity(entity.entityData);
      if (entity.entityData.package == "Cloud") {
        this.$router.push("/");
      } else if (entity.entityData.package == "Standalone") {
        this.$router.push("/sites");
      }
    },
  },
};
</script>
<style lang="scss">
.table-wrapper {
  .table {
    tbody tr {
      cursor: pointer;
    }
  }
}
</style>