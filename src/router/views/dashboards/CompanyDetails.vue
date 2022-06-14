<script>
import { mapActions, mapGetters } from "vuex";
import appConfig from "@/app.config";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import EntityForm from "@/components/entity/EntityForm";
import EditEntity from "@/components/entity/EditEntity";

export default {
  name: "ImportUsers",
  page: {
    title: "Import Users",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    EntityForm,
    EditEntity,
  },
  watch:{
    getEntities(entities){
      const {currentEntity,setCurrentEntity} = this;
      entities.length > 0 && entities.map(entity=>{
        if(entity.id == currentEntity.id){
          this.company = entity;
          setCurrentEntity(entity);
        }
      })
    }
  },
  data() {
    return {
      title: "Company Details",
      company: null,
    };
  },
  computed: {
    ...mapGetters("authfack", [
      "loadingStatus",
      "getUserInfo",
      "currentEntity",
    ]),
    ...mapGetters("entity", [
      "getEntities",
    ]),
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    ...mapActions("authfack", ["setCurrentEntity"]),
    ...mapActions("users", ["fetchDocuments"]),
  },
  beforeMount() {
    this.company = this.currentEntity;
    this.fetchDocuments();
  },
};
</script>

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
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <div class="card">
      <div class="card-body">
        <!-- dropdown -->
        <b-button
          variant="outline-primary"
          pill
          class="d-flex align-items-center text-center px-4 no-wrap float-right"
          size="sm"
          v-b-modal="'editEntity'"
          @click.stop="setData(company)"
        >
          <i class="bx bx-edit-alt font-size-18 mr-2"></i>
          Edit Company
        </b-button>
        <span class="drag-column-header">
          <h2 class="card-title mb-4 pb-1">{{ company.name }}</h2>
        </span>
        <div class="card task-box">
          <div class="card-body">
            <!-- subdomain  -->
            <b-form-group
              class="align-items-center text-muted h5 no-wrap"
              label-cols-sm="3"
              label-cols-lg="2"
              label="Subdomain:"
              label-for="subdomain"
            >
              <h5 id="subdomain" class="text-primary mb-0 no-wrap">
                {{ company.subdomain }}
              </h5>
            </b-form-group>
            <!-- package  -->
            <b-form-group
              class="align-items-center text-muted h5 no-wrap"
              label-cols-sm="3"
              label-cols-lg="2"
              label="Package:"
              label-for="package"
            >
              <h5 id="package" class="text-primary mb-0 no-wrap">
                {{ company.package }}
              </h5>
            </b-form-group>
            <!-- kiosk  -->
            <b-form-group
              class="align-items-center text-muted h5 no-wrap"
              label-cols-sm="3"
              label-cols-lg="2"
              label="kiosks:"
              label-for="kiosk"
            >
              <h5 id="kiosk" class="text-primary mb-0 no-wrap">
                {{ company.kiosks }}
              </h5>
            </b-form-group>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
