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
     updatedDetails (value) {
        this.company.company_phone = value.entity.company_phone;
        this.company.package = value.entity.package;
        this.company.imageUrl = value.entity.imageUrl;
        this.company.countryCode = value.entity.company_countryCode;
         console.log(this.company);
    },
    ...mapActions("modal", ["setData"]),
    ...mapActions("authfack", ["setCurrentEntity"]),
    ...mapActions("users", ["fetchDocuments"])
  },
  beforeMount() {
    this.company = this.currentEntity;
    this.fetchDocuments();
        console.log( this.company)
  },
};
</script>

<template>

  <Layout>
    <b-modal id="entityForm" hide-footer hide-header size="md" scrollable>
      <EntityForm/>
    </b-modal>
    <b-modal id="editEntity" hide-footer hide-header size="md" scrollable>
      <EditEntity  @editedForm="updatedDetails($event)"/>
    </b-modal>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    
    <div class="card">
      <div class="card-body">
        <div class="text-center">
          <div class="camera-BG" v-if="!company.imageUrl">
          <i class="mdi mdi-camera"></i>
          </div>
          <p class="text-muted" v-if="!company.imageUrl"><b>Note: </b>Logo needs to be at least 200px width, 45px height and 2MB max size.</p>
          <div  v-if="company.imageUrl">
            <img :src="company.imageUrl" alt="" class="img-bg">
          </div>
          <b-button
            variant="primary"
            pill
            class="px-5"
            size="sm"
            v-b-modal="'editEntity'"
            @click.stop="setData(company)"
          >
            Edit 
          </b-button>
          <hr>
        </div>
        <div class="">
        <div class="company-info row">
          <div class="company-info__card col-12  col-sm-12 col-lg-4">
            <div>
              <h6 class="text-muted">Company Name</h6>
              <p>{{ company.name }}</p>
            </div>
            <div>
              <h6 class="text-muted">Phone Number</h6>
              <p> +{{ company.countryCode}}{{ company.company_phone }}</p>
            </div>
          </div>
    
          <div class="company-info__card  col-12 col-sm-12 col-lg-4 ">
            <div>
            <h6 class="text-muted">Subdomain</h6>
            <p>  {{ company.subdomain }}</p>
            </div>
            <div>
            <h6 class="text-muted">Package</h6>
            <p>  {{ company.package }}</p>
        </div>
          </div>
          <div class="company-info__card col-sm-12 col-lg-4">
            <h6 class="text-muted">Number of kiosks</h6>
            <p>{{ company.kiosks }}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>
.camera-BG {
  display: inline-flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  background:#F2F2F2;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 8px;
}

 .img-bg {
    width: 400px;
    height: 100px;
    border: none;
    border-radius: 16px;
    position: relative;
    margin-bottom: 16px;
  }
 .mdi{
  font-size: 25pt;
  color: #8C8C8C;
}
.company-info__card {
  position: relative;

  & > div {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;

      @media  screen and (max-width: 991px) {
        margin-bottom: 20px;
    }
    }
  }

  h6 {
    margin-bottom: 5px;
  }
  p {
    margin-bottom: 0;
  }

  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 80%;
    right: 0;
    top: 10%;
    background-color: grey;

    @media  screen and (max-width: 991px) {
      display: none;
    }
  }

  &:last-child::after {
    display: none;
  }

  @media screen and (min-width: 992px){
    padding :0 60px;

    &:first-child {
      padding-left: 12px;
    }

    &:last-child {
      padding-right: 12px;
    }
  }
}

</style>
