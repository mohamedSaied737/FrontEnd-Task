<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Alert from "@/components/sharedCells/alert";
import store from "@/state/store";

const fileType = () => (value) => {
  let acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  return value !== null && acceptedTypes.includes(value.type);
};

let user = JSON.parse(localStorage.getItem("userDetails"));
let entity_id = store.getters["authfack/currentEntity"].id;

export default {
  title:"Import Users",
  name: "ImportUsers",
  components: {
    Layout,
    PageHeader,
    Alert,
  },
  validations: {
    form: {
      usersFile: {
        required,
        mustBeOfType: fileType(),
      },
      uniqueFields: {
        required,
      },
      duplicateUsers: {
        required,
      },
    },
  },
  data() {
    return {
      title: "Importing Users",
      form: {
        usersFile: null,
        imagesFile: null,
        uniqueFields: ["email"],
        duplicateUsers: "Ignore",
      },
      imagesFileFize: 0,
      validImagesFileSize: true,
      columnDefs: [],
      rowData: [],
      userId: user.id,
      entityId: entity_id,
    };
  },
  computed: {
    ...mapGetters("usersImport", ["getLoadingStatus"]),
    alert() {
      return {
        message: store.state.notification.message,
        type: store.state.notification.type,
        show: store.state.notification.show,
      };
    },
  },
  methods: {
    ...mapActions("usersImport", ["importUsers", "resetLoading"]),
    onFileChange(e) {
      this.form.usersFile = e.target.files[0];
    },
    onImagesFileChange(e) {
      if (e.target.files[0].size > 50000000000) {
        this.validImagesFileSize = false;
        this.form.imagesFile = null;
      } else {
        this.validImagesFileSize = true;
        this.form.imagesFile = e.target.files[0];
      }
    },
    submitImportedUsers() {
      let formData = this.gatherFormData();
      if (this.validImagesFileSize) {
        this.importUsers(formData);
      } else {
        this.$toast.error("File Size Should not Exceed 50GB.", {
          position: "top-right",
        });
      }
    },
    gatherFormData() {
      //create formData to send normal dta with files
      let formdata = new FormData();
      formdata.append("users", this.form.usersFile);
      formdata.append("images", this.form.imagesFile);
      const json = JSON.stringify({
        unique_fields: this.form.uniqueFields,
        update_duplicates: this.form.duplicateUsers,
        entity_id: this.entityId,
        user_id: this.userId,
      });
      formdata.append("data", json);
      return formdata;
    },
  },
  beforeMount() {
    this.resetLoading();
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" className="d-flex align-items-center justify-content-between">
      <div class="page-title-right">
           <router-link 
            to=/users/import/queue
            >
            <b-button class="d-flex align-items-center px-3 top-page-btn" variant="primary" pill size="sm">
                <i class="bx bx-right-arrow-alt font-size-18 mr-2"></i>
                 Import Queue
              </b-button>
              </router-link >
      </div>
    </PageHeader>
    <Alert :message="alert.message" :type="alert.type" :show="alert.show" />
      <div class="row mt-4">
        <div class="col-lg-12">
          <form
            name="import"
            @submit.prevent="submitImportedUsers"
            enctype="multipart/form-data"
          >
            <b-card>
              <h5 class="text-dark mx-2">For User Information</h5>
              <b-card-body>
                <ol>
                  <!-- 1 -->
                <li class="download-item">
                <div class="d-flex align-items-center row">
                    <p class="mb-0 col-md-3">Download Excel Template</p>
                    <div class="col-md-4 d-flex align-items-center">
                      <a
                        href="/demo_users.xlsx"  
                        target="_blank"
                        class="btn btn-outline-primary btn-sm rounded-pill px-3"
                        >Download
                      </a >
                      <span class="text-muted no-wrap text-left mx-3">Instructions Inside The Template</span>
                    </div>
                  </div>
                  </li>
                  <!-- 2 -->
                 <li class="mb-4">
                <div class="d-md-flex align-items-center mb-2 row">
                    <p class="mb-0 col-md-3">Locate Excel File to Upload</p>
                    <div class="col-md-3">
                      <b-file
                        class="file-upload"
                        id="fileUpload"
                        name="users"
                        @change="onFileChange"
                        accept=".xls, .xlsx"
                        size="sm"
                      />
                    </div>
                    <span class="text-muted col-md-6">
                      The uploaded Excel file cannot exceed 2M,
                      the only supported format is .xlsx and it shouldn't be downloaded from Google sheets.
                      </span>
                  </div>
                  </li>
                <!-- 3 -->
                <li class="mb-4">
                <div class="d-flex align-items-center row">
                    <p class="mb-0 col-md-3">Select Unique Migration Field</p>
                    <div class="col-md-9 d-flex">
                        <b-form-checkbox
                          v-model="form.uniqueFields"
                          value="first_name"
                          class="text-color"
                          >First Name</b-form-checkbox
                        >
                        <b-form-checkbox
                          v-model="form.uniqueFields"
                          value="last_name"
                          class=" text-color mx-2"
                          >Last Name</b-form-checkbox
                        >
                        <b-form-checkbox
                          v-model="form.uniqueFields"
                          value="email"
                          class=" text-color mx-2"
                          checked
                          disabled
                          >Email</b-form-checkbox
                        >
                    </div>

                  </div>
                  </li>
               <!-- 4 -->
                <li class="mb-4">
                <div class="row">
                    <p class="mb-0 col-md-3">Duplicate Users Should Be</p>
                    <div class="d-flex col-md-9">
                    <b-form-radio
                      v-model="form.duplicateUsers"
                      class="text-color"
                      value="Update"
                    >Updated</b-form-radio>
                    <b-form-radio
                      v-model="form.duplicateUsers"
                      class="text-color mx-4"
                      value="Ignore"
                    >Ignored</b-form-radio>
                  </div>
                  </div>
                  </li>
               <!-- 5 -->
                <li class="mb-4">
                <div class="row align-items-center">
                    <p class="mb-0 col-md-3">Click Upload at the bottom to Import Users</p>
                        <span class="text-muted col-md-9"
                        >After the import is completed, you can view the
                        imported personnel in Users List.</span
                      >
                  </div>
                  </li>
                </ol>
              </b-card-body>
            </b-card>
            <b-card>
              <h5 class="text-dark mx-2">For User Photos (Optional)...</h5>
              <b-card-body>
                <ol>
                  <li class="mb-4">
                    <p class="mb-0 text-color">Images zip file can't exceed 50MB.</p>
                  </li>
                  <li class="mb-4">
                    <p class="mb-0 text-color">Image name in the excel sheet must contain image extension (image_name.jpg, image_name.png for example).</p>
                  </li>
                  <!-- 1 -->
                  <li class="mb-4">
                    <p class="mb-0 text-color">Image name can't contain spaces or special characters (accepted characters are '_' and '-').</p>
                  </li>
                  <!-- 2 -->
                  <li class="mb-4">
                    <p class="mb-0 text-color">Each image should be bright, clear and show the person’s
                      face and ears without angle.</p>
                  </li>
                  <!-- 3 -->
                  <li class="mb-4">
                    <p class="mb-0 text-color">Supported image formats are JPG and PNG.</p>
                  </li>
                  <!-- 4 -->
                  <li class="mb-4">
                    <p class="mb-0 text-color">The recommended size per photo is 640px x 480px and the
                      each individual file should not exceed 500KB.</p>
                  </li>
                   <!-- 5 -->
                  <li class="mb-4">
                    <p class="mb-0 text-color">The zip file must contain images only directly without any folders.</p>
                  </li>
                   <!-- 6 -->
                  <li class="mb-4">
                    <div class="row align-items-center">
                    <p class="mb-0 col-md-3 no-wrap">Choose the ZIP file ( Only ZIP Extension ) </p>
                    <div class="col-md-3">
                      <b-file
                        class="file-upload"
                        :class="{ 'is-invalid': validImagesFileSize == false }"
                        id="imagesUpload"
                        name="images"
                        @change="onImagesFileChange"
                        accept=".zip"
                        size="sm"
                      />
                    <p v-if="!validImagesFileSize" class="text-danger mb-0">File Size Should not Exceed 50 GB.</p>
                    </div>
                    </div>
                  </li>
                </ol>
                <div class="d-flex align-items-center my-4">
            <b-button
            variant="primary"
            type="submit"
            pill
            :disabled="getLoadingStatus || !form.usersFile"
            class="btn btn-sm btn-lt px-5"
            size="md"
          >
            <i
              v-if="getLoadingStatus"
              class="bx bx-loader bx-spin font-size-16 align-middle mr-2"
            ></i>
            Upload
          </b-button>
              </div>
              </b-card-body>
           
            </b-card>
          </form>
        </div>
        <!-- end col -->
      </div>
    <!-- end row -->
  </Layout>
</template>

<style lang="scss" scoped>
.download-item {
  margin-bottom: 19px;
}
.custom-file-label {
  border-color: #ccc !important;
}
.b-form-file {
  label {
    justify-content: left;
  }
}
.bv-no-focus-ring {
  display: flex;
}
.list-title {
  width: 300px;
  color: #495057;
}
.text-color {
  color: #495057;
}
</style>
