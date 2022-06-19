<script>
import { mapActions, mapGetters } from "vuex";
import { numeric, required } from "vuelidate/lib/validators";
import VueCountryCode from "vue-country-code";

export default {
  name: "EntityForm",
  components: { VueCountryCode },
  data() {
    return {
      id: null,
      form: {
        entity: {
          company_phone: null,
          package: "Standalone",
          imageUrl: '',
        },
        entity_setting: {
          temperature_display_unit_for_company: null,
        },
      },
      submitted: false,
      imageLoaded: false,
      imgUrl: null,
      imageData: {
          size:'',
          height:'',
          width:'',
          url: ''
      },
      imageError: false,
      companyCountryCode: '',
    };
  },
  validations: {
    form: {
      entity: {
        company_phone: { required, numeric },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("authfack", ["userDetails"]),
    ...mapGetters("entity", [
      "getEntities",
      "getLoading",
      "getIsValidSubdomian",
    ]),
    userEmail() {
      return this.userDetails && this.userDetails.email;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("editEntity");
    },
  },
  methods: {
    ...mapActions("entity", ["updateEntity"]),
    onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // const { id, form, updateEntity } = this;
        // updateEntity({
        //   id: id,
        //   params: form,
        // });
        this.form.entity.imageUrl = this.imageData.url;
         this.form.entity.company_phone = this.form.entity.company_phone;
         this.form.entity.company_countryCode = this.companyCountryCode;
        console.log(this.form)
        this.$emit('editedForm', this.form)
        document.getElementById('close-button').click();
      }
    },
    pickImage() {
      document.getElementById('imagePicker').click();
    },
    removeImage() {
      this.imageData.url = '';
    },
    onFileChange(e) {
      // const file = e.target.files[0];
      // this.imgUrl = URL.createObjectURL(file);
      // console.log(this.imgUrl)

      this.imageError = false;
      this.imageData.width = '';
      this.imageData.height = '';
      this.imageData.url = '';
      let file = e.target.files[0];
      console.log( file)
      if(!file || file.type.indexOf('image/') !== 0) return this.imageError = true;

      this.imageData.size = file.size;

       let reader = new FileReader();

       reader.readAsDataURL(file);
        reader.onload = evt => {
        let img = new Image();
        img.onload = () => {
           if( img.width < 200 || img.height < 45 || this.imageData.size > 2097152 ) {
            return this.imageError = true;
          }
          this.imageData.width = img.width;
          this.imageData.height = img.height;
          this.imageLoaded = true;
          this.imageData.url = URL.createObjectURL(file);
        }
        img.src = evt.target.result;
          console.log( this.imageData)
      }
       reader.onerror = evt => {
        console.error(evt);
      }
    },
     onSelectCompanyCountryCode({ dialCode }) {
      this.companyCountryCode = dialCode;
    },
  },
  beforeMount() {
    const { getModalInfo } = this;
    if (getModalInfo) {
      console.log('edit compan', this.getModalInfo);
      this.id = getModalInfo.id;
      this.form.entity.company_phone = getModalInfo.company_phone;
      this.form.entity.company_email = getModalInfo.company_email;
      this.form.entity.package = getModalInfo.package;
      this.form.entity_setting.temperature_display_unit_for_company =
        getModalInfo.setting[0].pivot.value;
    }
  },
};
</script>

<template>
  <div class="kiosk-form-wrapper">
    <div class="form-groups">
      <div class="form-section">
        <h4 class="text-black mb-3 text-center">Edit Company</h4>
        <i id="close-button" class='fas fa-times-circle close-btn' @click="$bvModal.hide('editEntity')"></i>
        <div class="text-center">

          <button  type="button" @click="pickImage" :class="[imageError?  'red-border' : '', 'camera-BG']"
            v-if="!imageData.url">
               <b-form-file
                id="imagePicker"
                @change="onFileChange"
                class="d-none"
              ></b-form-file>
              <span class="d-block">
            <i class="mdi mdi-camera"></i>
              </span>
          </button>

           <div v-if="imageData.url">
              <img :src="imageData.url" class="img-bg"/>
              <div class="img-bg__cover"></div>
              <b-form-file
              id="imagePicker"
              @change="onFileChange"
              class="d-none"
              ></b-form-file>
              <span class="d-block">
                <i type="button" @click="pickImage" style="position:absolute; top:15%; left:45%" class="mdi mdi-camera"></i>
                <button type="button" @click="removeImage()"
                class="remove-btn">Remove</button>
              </span>
          </div>
          
          <p class="text-muted" v-if="!imageError && !imageData.url"><b>Note: </b>Logo needs to be at least 200px width, 45px height and 2MB max size.</p>
          <p class="text-danger mt-3" v-if="imageError && !imageData.url"><b>Note: </b>Couldn’t upload your logo because it needs to be at least 200px width, 45px height and 2MB max size.</p>
        </div>
      </div>
   
      <!-- package  -->
       <b-form-group
        v-if="userEmail == 'lt_techteam@visipoint.com'"
        class="form-section"
      >
      <div>
        <h5> Company Subscription</h5>
      </div>
        <div class="form-radio-wrapper form-radio-wrapper_custom mt-4 d-flex align-items-center">
          <b-form-radio
            v-model="form.entity.package"
            name="standalone"
            value="Standalone"
            >Standalone</b-form-radio
          >
          <b-form-radio
            class="mx-5"
            v-model="form.entity.package"
            name="cloud"
            value="Cloud"
            >Cloud</b-form-radio
          >
        </div>
        <div class="form-radio-wrapper__info">
          <p v-if="form.entity.package == 'Standalone'" class="text-muted" >Note: No updates of the "Expected" visits will be synced to the visitors' VisiPoint Passport (if they have ones).</p>
        </div>
      </b-form-group>
      <hr>
      <!-- phone  -->
      <b-form-group
      class="form-section"
        id="name-group"
        label-for="phone"
      >
        <div class="phone-input-wrapper ">
          <VueCountryCode
            :enabledCountryCode="true"
            :preferredCountries="['GB']"
            @onSelect="onSelectCompanyCountryCode"
            label-cols-sm="2"
            class="phone-input"
          >
          </VueCountryCode>
          <b-form-input
            id="phone"
            type="text"
            placeholder="Enter Phone"
            v-model="form.entity.company_phone"
            class="phone-input phone-input_custom"
            label-cols-sm="7"
              :class="{
              'is-invalid': submitted && $v.form.entity.company_phone.$error,
            }"
          ></b-form-input>
           <div
            v-if="submitted && !$v.form.entity.company_phone.required"
            class="invalid-feedback"
          >
            <span class="no-wrap">Phone is required.</span>
          </div>
          <div
            v-if="submitted && !$v.form.entity.company_phone.numeric"
            class="invalid-feedback"
          >
            <span class="no-wrap">
              Phone number should contain only digits.
            </span>
          </div>
        </div>
      </b-form-group>
      <hr>
      <!-- Temperature Unit -->
      <b-form-group label-for="temperature" class="form-section">
        <div>
          <h5>Temperature Unit</h5>
        </div>
        <div class="form-radio-wrapper_custom d-flex align-items-center mt-4">
          <b-form-radio
            v-model="form.entity_setting.temperature_display_unit_for_company"
            value="f"
            >°F</b-form-radio
          >
          <b-form-radio
            class="mx-5"
            v-model="form.entity_setting.temperature_display_unit_for_company"
            value="c"
            >°C</b-form-radio
          >
        </div>
      </b-form-group>
    </div>
    <!-- action btns  -->
    <div class="d-flex justify-content-center align-items-center mt-2">
      <button
        class="submit-btn btn btn-primary px-4"
        size="lg"
        @click="onSubmit"
        :disabled="getLoading"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span v-else>
          Save Changes
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kiosk-form-wrapper {
  padding: 0;
  .form-section {
    margin: 30px 0;

  &:first-child {
      margin-top: 0;
    }
    
  }
 h4 {
    color:#000000;
    font-size: 17px;
  }
  p {
    font-size: 12px;
  }
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
    border: none;
  }

  .red-border {
    border: 1px solid red;
  }

  .img-bg {
    width: 400px;
    height: 100px;
    border: none;
    border-radius: 16px;
    position: relative;
  }

  .mdi{
    font-size: 25pt;
    color: #8C8C8C;
  }

  .phone-input {
    background : #F2F2F2; 
    border: none;
    border-radius: 4px;
  }

  .close-btn{
    position: absolute;
    top: 6%;
    right: 5%;
    cursor: pointer;
    color: red;
  }

  .submit-btn {
    margin-top: 20px;
    padding: 8px 140px !important;
    border-radius: 25px;
  }

}
.form-radio-wrapper__info {
  width:80%; 
  margin: 0 auto;
  text-align: center;
  margin-top: 16px;
}
.form-radio-wrapper_custom::v-deep  .custom-control-label::after {
    background-color: #f2f2f2;
    border: 0;
    border-radius: 50%;
}
.form-radio-wrapper_custom::v-deep {
.custom-control-label { 
  color:#606060;
}
.custom-radio .custom-control-input:checked  ~ .custom-control-label {
  color: #103F5E;
}
 .custom-radio .custom-control-input:checked ~ .custom-control-label::after {
    border-color: #103F5E;
    background-color: #103F5E;
    background-image: none;
    border: 3px solid #fafafa;
  }

}
.remove-btn {
    position:absolute; 
    top:24%; 
    left:42%;
    border: none;
    color: #fff;
    border-radius: 8px;
    background: #F46A6A;;
  
  }

.phone-input_custom {
  width: calc(100% - 15px);
   margin-left: auto;
}
</style>
