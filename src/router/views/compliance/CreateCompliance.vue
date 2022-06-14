<template>
  <Layout>
    <Alert :message="alert.message" :type="alert.type" :show="alert.show" />
    <section id="createCompliance">
      <b-card class="card-form">
        <h4 class="card-subtitle">
          {{
            $route.name == "createCompliance"
              ? "Create Compliance"
              : "Edit Compliance"
          }}
        </h4>
        <b-card-body>
          <b-form @submit.prevent="onSubmit">
            <div class="form-width">
              <!-- Name -->
              <b-form-group
                class="text-muted"
                id="name-group"
                label="Compliance Name"
                label-for="name"
              >
                <b-form-input
                  max-length="2"
                  id="name"
                  placeholder="Enter Compliance Name"
                  v-model="form.name"
                  type="text"
                  :class="{
                    'is-invalid': submitted && $v.form.name.$error,
                  }"
                />
                <div
                  v-if="submitted && $v.form.name.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.name.required">Name is required</span>
                  <span v-else-if="!$v.form.name.minLength"
                    >Name should be 2 characters at least</span
                  >
                  <span v-else-if="!$v.form.name.maxLength"
                    >The Maximum length is {{ $v.form.name.$params.maxLength.max }} characters</span
                  >
                </div>
              </b-form-group>
              <!-- Type -->
              <b-form-group class="text-muted" label="Type" label-for="type">
                <multiselect
                  id="type"
                  v-model="form.type"
                  :options="typeOptions"
                  placeholder="Select Type"
                  :show-labels="false"
                  :allowEmpty="true"
                >
                  <template slot="option" slot-scope="props">
                    <div class="option__desc">
                      <span class="text-capitalize"> {{ props.option }}</span>
                    </div>
                  </template>
                </multiselect>
              </b-form-group>
              <div v-if="form.type">
                <div
                  v-if="
                    form.type === 'agreement' || form.type === 'questionnaire'
                  "
                  class="desired-answer-container"
                >
                  <!-- question -->
                  <b-form-group
                    v-if="form.type === 'questionnaire'"
                    class="text-muted"
                    id="question-group"
                    label="Question"
                    label-for="questionInput"
                  >
                    <b-form-input
                      id="questionInput"
                      v-model="form.questionInput"
                      placeholder="Enter Your Question"
                      :maxlength="2001"
                      type="text"
                      :class="{
                        'is-invalid': submitted && $v.form.questionInput.$error,
                      }"
                    >
                    </b-form-input>
                    <div
                      v-if="submitted && $v.form.questionInput.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.questionInput.required"
                        >Question is required</span
                      >
                      <span v-if="!$v.form.questionInput.minLength"
                        >The minimum length is {{ $v.form.questionInput.$params.minLength.min }} characters</span
                      >
                      <span v-if="!$v.form.questionInput.maxLength"
                        >The Maximum length is {{ $v.form.questionInput.$params.maxLength.max }} characters</span
                      >
                    </div>
                  </b-form-group>
                  <!-- agreement  -->
                  <b-form-group
                    v-else
                    class="text-muted"
                    label="Agreement Text"
                    label-for="agreement-txt"
                  >
                    <b-form-textarea
                      id="agreement-txt"
                      placeholder="Enter your agreement"
                      v-model="form.agreementTxt"
                      type="text"
                      :class="{
                        'is-invalid': submitted && $v.form.agreementTxt.$error,
                      }"
                    >
                    </b-form-textarea>
                    <div
                      v-if="submitted && $v.form.agreementTxt.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.agreementTxt.required"
                        >Agreement text is required</span
                      >
                      <span v-if="!$v.form.agreementTxt.minLength"
                        >The minimum length is {{ $v.form.agreementTxt.$params.minLength.min }} characters</span
                      >
                      <!-- <span v-if="!$v.form.agreementTxt.maxLength"
                        >The Maximum length is {{ $v.form.agreementTxt.$params.maxLength.max }} characters</span
                      > -->
                    </div>
                  </b-form-group>
                  <h5 class="comp-subtitle text-muted">Desired Answer</h5>
                  <!-- Yes -->
                  <div class="quiz-container flex-row">
                    <b-form-checkbox
                      class="comp-checkbox"
                      v-model="form.yesChecked"
                    />
                    <div class="comp-input-container">
                      <label for="yesStatement">Positive Answer</label>
                      <b-form-input
                        class="compliance-custom-input"
                        v-model="form.yesStatement"
                        id="yesStatement"
                        placeholder="Statement"
                        :maxlength="28"
                        :class="{
                          'is-invalid':
                            submitted && $v.form.yesStatement.$error,
                        }"
                      />
                      <div
                        v-if="submitted && $v.form.yesStatement.$error"
                        class="invalid-feedback"
                      >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.form.yesStatement.required"
                          >Statement text is required.</span
                        >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.form.yesStatement.maxLength"> 
                          The Maximum length is {{$v.form.yesStatement.$params.maxLength.max}}characters
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- No -->
                  <div class="quiz-container flex-row">
                    <b-form-checkbox
                      class="comp-checkbox"
                      v-model="form.noChecked"
                    />
                    <div class="comp-input-container">
                      <label for="noStatement">Negative Answer</label>
                      <b-form-input
                        class="compliance-custom-input"
                        v-model="form.noStatement"
                        id="noStatement"
                        placeholder="Statement"
                        :maxlength="28"
                        :class="{
                          'is-invalid': submitted && $v.form.noStatement.$error,
                        }"
                      />
                      <div
                        v-if="submitted && $v.form.noStatement.$error"
                        class="invalid-feedback"
                      >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.form.noStatement.required"
                          >Statement text is required.</span
                        >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.form.noStatement.maxLength"> 
                          The Maximum length is {{$v.form.noStatement.$params.maxLength.max}} characters
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    class="
                      text-danger
                      mt-4
                      err-font
                      border-top border-bottom
                      py-2
                    "
                    v-if="!this.form.yesChecked && !this.form.noChecked"
                  >
                    At least one answer should be checked
                  </p>
                  <transition-group name="fade" mode="out-in">
                    <li v-for="(el, index) in answers" :key="index">
                      <AddedQuestion
                        :element="el"
                        :index="index"
                        :deleteQuestion="deleteQuestion"
                        :type="form.type"
                        :submitted="submitted"
                        :setAddedQuestioinsErr="setAddedQuestioinsErr"
                      />
                    </li>
                  </transition-group>
                  <div class="text-danger mt-3" v-if="showErr">
                    <p class="err-font">Fields above should be filled first</p>
                  </div>
                  <div
                    v-if="answers.length < questionsLimit"
                    class="quiz-btns-box"
                  >
                    <button
                      @click.prevent="onQuestionsSubmission"
                      v-if="form.type === 'questionnaire'"
                    >
                      Add question
                    </button>
                  </div>
                </div>
                <!-- vaccine -->
                <div v-else class="desired-answer-container">
                  <h5 class="comp-subtitle text-muted">Desired Outcomes</h5>
                  <!-- uploaded -->
                  <div class="quiz-container flex-row">
                    <b-form-checkbox
                      class="comp-checkbox"
                      v-model="form.yesChecked"
                      disabled
                    >
                      Document Uploaded
                    </b-form-checkbox>
                    <div class="comp-input-container w-75">
                      <b-form-input
                        class="compliance-custom-input"
                        v-model="vaccine.uploadedStatement"
                        id="yesStatement"
                        placeholder="Statement"
                        :class="{
                          'is-invalid':
                            submitted && $v.vaccine.uploadedStatement.$error,
                        }"
                      />
                      <div
                        v-if="submitted && $v.vaccine.uploadedStatement.$error"
                        class="invalid-feedback"
                      >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.vaccine.uploadedStatement.required"
                          >Statement text is required.</span
                        >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.vaccine.uploadedStatement.maxLength">
                          The Maximum length is {{$v.vaccine.uploadedStatement.$params.maxLength.max}} characters
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- not uploaded -->
                  <div class="quiz-container flex-row">
                    <b-form-checkbox
                      class="comp-checkbox"
                      v-model="form.noChecked"
                    >
                      Document Not Uploaded
                    </b-form-checkbox>
                    <div class="comp-input-container w-75">
                      <b-form-input
                        class="compliance-custom-input"
                        v-model="vaccine.notUploadedStatement"
                        id="noStatement"
                        placeholder="Statement"
                        :class="{
                          'is-invalid':
                            submitted && $v.vaccine.notUploadedStatement.$error,
                        }"
                      />
                      <div
                        v-if="
                          submitted && $v.vaccine.notUploadedStatement.$error
                        "
                        class="invalid-feedback"
                      >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.vaccine.notUploadedStatement.required"
                          >Statement text is required</span
                        >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.vaccine.notUploadedStatement.maxLength"> 
                          The Maximum length is {{$v.vaccine.notUploadedStatement.$params.maxLength.max}} characters
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="
                      this.form.yesChecked == false &&
                        this.form.noChecked == false
                    "
                    style="
                      width: 100%;
                      margin-top: 0.25rem;
                      font-size: 80%;
                      color: #f46a6a;
                    "
                  >
                    <span> *Should select one at least</span>
                  </div>
                  <div class="text-danger text-center mt-3" v-if="showErr">
                    <p>Fields above should be filled first</p>
                  </div>
                  <div class="settings mt-4">
                    <!-- protocols  -->
                    <b-form-group
                      class="align-items-center"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="Protocols"
                      label-for="protocols"
                    >
                      <multiselect
                        id="protocols"
                        :class="{
                          'is-invalid invalid-select-input':
                            submitted && $v.vaccine.protocols.$error,
                        }"
                        v-model="vaccine.protocols"
                        :options="protocolsOptions"
                        placeholder="Select protocols"
                        :show-labels="false"
                        :allowEmpty="true"
                        multiple
                      />
                      <div
                        v-if="submitted && $v.vaccine.protocols.$error"
                        class="invalid-feedback"
                      >
                        <span
                          style="font-size: 0.8rem"
                          v-if="!$v.vaccine.protocols.required"
                          >At lease one protocol should be selected</span
                        >
                      </div>
                    </b-form-group>
                    <!-- document_binding -->
                    <b-form-group
                      class="align-items-center"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="Document Binding to"
                      label-for="questionInput"
                    >
                      <div class="d-flex align-items-center">
                        <b-form-radio
                          v-model="vaccine.document_binding"
                          value="profile"
                        />
                        <span>User Profile</span>
                      </div>
                    </b-form-group>
                    <!-- pcr  -->
                    <b-form-group
                      label-cols-sm="5"
                      label-cols-md="4"
                      label-cols-lg="3"
                      label="Accept Negative PCR"
                      label-for="mask"
                      class="align-items-center input-wrapper no-wrap"
                    >
                      <b-form-checkbox
                        switch
                        size="lg"
                        v-model="vaccine.pcr"
                      ></b-form-checkbox>
                    </b-form-group>
                    <!-- validation days  -->
                    <b-form-group
                      v-if="vaccine.pcr"
                      label="PCR valid for how many days?"
                      label-cols-sm="4"
                      label-cols-lg="3"
                    >
                      <b-input
                        id="questionInput"
                        v-model="vaccine.validationDays"
                        placeholder="Enter number of days"
                        type="number"
                        :class="{
                          'is-invalid':
                            submitted && $v.vaccine.validationDays.$error,
                        }"
                        max="365"
                      >
                      </b-input>
                      <div
                        v-if="submitted && $v.vaccine.validationDays.$error"
                        class="invalid-feedback"
                      >
                    <span v-if="!$v.vaccine.validationDays.required"
                          >Validation days number is required</span
                        >
                      </div>
                      <div
                        v-if="submitted && $v.vaccine.validationDays.$error"
                        class="invalid-feedback"
                      >
                    <span v-if="!$v.vaccine.validationDays.maxLength"
                          >Validation days should be 3 digits</span
                        >
                      </div>
                      <div
                        v-if="submitted && !$v.vaccine.validationDays.numeric"
                        class="invalid-feedback"
                      >
                    <span
                          >Validation days should be a number</span
                        >
                      </div>
                    </b-form-group>
                  </div>
                </div>
                <!-- submit button -->
                <div class="submit-btn-container flex-row">
                  <b-button
                    variant="primary"
                    type="submit"
                    :disabled="getLoading"
                    class="w-25"
                    size="md"
                    pill
                  >
                    <i
                      v-if="getLoading"
                      class="
                        bx bx-loader bx-spin
                        font-size-16
                        align-middle
                        mr-2
                      "
                    ></i>
                    <span v-else>
                      {{
                        $route.name == "updateCompliance" ? "Update" : "Create"
                      }}
                    </span>
                  </b-button>
                </div>
              </div>
            </div>
          </b-form>
        </b-card-body>
      </b-card>
    </section>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import { mapActions, mapGetters } from "vuex";
import {
  required,
  requiredIf,
  minLength,
  maxLength,
  numeric
} from "vuelidate/lib/validators";
import Alert from "@/components/sharedCells/alert";
import store from "@/state/store";
import AddedQuestion from "./AddedQuestion";
import Multiselect from "vue-multiselect";

export default {
  name: "CreateCompliance",
  title: "Compliance Form",
  components: {
    Layout,
    Alert,
    AddedQuestion,
    Multiselect,
  },
  data: function() {
    return {
      form: {
        name: "",
        type: null,
        agreementTxt: "",
        questionInput: "",
        noStatement: "",
        yesStatement: "",
        noChecked: false,
        yesChecked: true,
      },
      vaccine: {
        document_binding: "profile",
        pcr: false,
        validationDays: null,
        uploadedStatement: "Vaccinated",
        notUploadedStatement: "Unchecked",
        protocols: null,
      },
      answers: [],
      questionsLimit: 4,
      typeOptions: ["questionnaire", "agreement", "Document - Vaccine/PCR"],
      protocolsOptions: [
        "EU Digital COVID Certificate",
        "NHS (Domestic/International)",
        "Smart Health Card (SHC)",
        "NYS Excelsior Pass & NYS Excelsior Pass Plus",
      ],
      submitted: false,
      showErr: false,
      addedQuestioinsErr: false,
    };
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(30),
      },
      agreementTxt: {
        required: requiredIf(function(form) {
          return form.type === "agreement";
        }),
        minLength: minLength(5),
        // maxLength: maxLength(2000),
        
      },
      questionInput: {
        required: requiredIf(function(form) {
          return form.type === "questionnaire";
        }),
        minLength: minLength(5),
        maxLength: maxLength(2000),
      },
      yesStatement: {
        required: requiredIf(function(form) {
          return form.type === "questionnaire" || form.type === "agreement";
        }),
        maxLength: maxLength(27),

      },
      noStatement: {
        required: requiredIf(function(form) {
          return form.type === "questionnaire" || form.type === "agreement";
        }),
        maxLength: maxLength(27),
      },
    },
    vaccine: {
      validationDays: {
        required: requiredIf(function(vaccine) {
          return vaccine.pcr;
        }),
        numeric,
        maxLength: maxLength(3),
      },
      uploadedStatement: {
        required: requiredIf(function() {
          return (
            this.form.type !== "questionnaire" && this.form.type !== "agreement"
          );
        }),
        maxLength: maxLength(27),
      },
      notUploadedStatement: {
        required: requiredIf(function() {
          return (
            this.form.type !== "questionnaire" && this.form.type !== "agreement"
          );
        }),
        maxLength: maxLength(27),
      },
      protocols: {
        required: requiredIf(function() {
          return (
            this.form.type !== "questionnaire" && this.form.type !== "agreement"
          );
        }),
      },
    },
  },
  computed: {
    ...mapGetters("compliance", ["getLoading", "getComplianceDetails"]),
    alert() {
      return {
        message: store.state.notification.message,
        type: store.state.notification.type,
        show: store.state.notification.show,
      };
    },
    printProtocolsArr() {
      const {
        vaccine: { protocols },
      } = this;
      return protocols
        ? protocols.map((protocol) => {
            switch (protocol) {
              case "EU Digital COVID Certificate":
                return "eu";
              case "NHS (Domestic/International)":
                return "nhs";
              case "Smart Health Card (SHC)":
                return "shc";
              case "NYS Excelsior Pass & NYS Excelsior Pass Plus":
                return "nys";
              default:
                return;
            }
          })
        : null;
    },
  },
  watch: {
    getComplianceDetails(details) {
      if (details && details.form_metadata.data) {
        (this.form.name = details.name),
          details.form_metadata.data.length > 0 &&
            details.form_metadata.data.map((item) => {
              (this.form.type =
                item.type == "vaccine_document"
                  ? "Document - Vaccine/PCR"
                  : item.type),
                this.form.type == "agreement"
                  ? (this.form.agreementTxt = item.body)
                  : (this.form.questionInput = item.body),
                (this.form.agreementTxt = details.form_metadata.data[0].body);
              this.form.questionInput = details.form_metadata.data[0].body;
              if (details.type == "vaccine_document") {
                this.vaccine.uploadedStatement =
                  details.form_metadata.data[0].answers[0].text;
                this.vaccine.notUploadedStatement =
                  details.form_metadata.data[0].answers[1].text;
                this.form.yesChecked =
                  details.form_metadata.data[0].answers[0].desired;
                this.form.noChecked =
                  details.form_metadata.data[0].answers[1].desired;
                this.vaccine.protocols = this.getProtocolsValueOnUpdate(
                  details.form_metadata.data[0].protocols
                );
              } else {
                this.form.yesStatement =
                  details.form_metadata.data[0].answers[0].text;
                this.form.noStatement =
                  details.form_metadata.data[0].answers[1].text;
                this.form.yesChecked =
                  details.form_metadata.data[0].answers[0].desired;
                this.form.noChecked =
                  details.form_metadata.data[0].answers[1].desired;
              }
              // handle vaccine update
              if (details.form_metadata.data[0].pcr) {
                this.vaccine.pcr = true;
                this.vaccine.validationDays =
                  details.form_metadata.data[0].pcr.days;
              }
            });
        if (details.form_metadata.data.length > 1) {
          for (
            let index = 1;
            index < details.form_metadata.data.length;
            index++
          ) {
            this.onQuestionsSubmission();
            this.answers[index - 1][0].question =
              details.form_metadata.data[index].body;
            this.answers[index - 1][1].text =
              details.form_metadata.data[index].answers[0].text;
            this.answers[index - 1][1].desired =
              details.form_metadata.data[index].answers[0].desired;
            this.answers[index - 1][2].text =
              details.form_metadata.data[index].answers[1].text;
            this.answers[index - 1][2].desired =
              details.form_metadata.data[index].answers[1].desired;
          }
        }
      } else if (details && details.form_metadata.questions) {
        (this.form.name = details.name),
          details.form_metadata.questions.length > 0 &&
            details.form_metadata.questions.map((item) => {
              (this.form.type =
                item.type == "vaccine_document"
                  ? "Document - Vaccine/PCR"
                  : item.type),
                this.form.type == "agreement"
                  ? (this.form.agreementTxt = item.body)
                  : (this.form.questionInput = item.body),
                (this.form.agreementTxt =
                  details.form_metadata.questions[0].body);
              this.form.questionInput = details.form_metadata.questions[0].body;
              if (details.type == "vaccine_document") {
                this.vaccine.uploadedStatement =
                  details.form_metadata.questions[0].answers[0].text;
                this.vaccine.notUploadedStatement =
                  details.form_metadata.questions[0].answers[1].text;
                this.form.yesChecked =
                  details.form_metadata.questions[0].answers[0].desired;
                this.form.noChecked =
                  details.form_metadata.questions[0].answers[1].desired;
                this.vaccine.protocols = this.getProtocolsValueOnUpdate(
                  details.form_metadata.questions[0].protocols
                );
              } else {
                this.form.yesStatement =
                  details.form_metadata.questions[0].answers[0].text;
                this.form.noStatement =
                  details.form_metadata.questions[0].answers[1].text;
                this.form.yesChecked =
                  details.form_metadata.questions[0].answers[0].desired;
                this.form.noChecked =
                  details.form_metadata.questions[0].answers[1].desired;
              }
              // handle vaccine update
              if (details.form_metadata.questions[0].pcr) {
                this.vaccine.pcr = true;
                this.vaccine.validationDays =
                  details.form_metadata.questions[0].pcr.days;
              }
            });
        if (details.form_metadata.questions.length > 1) {
          for (
            let index = 1;
            index < details.form_metadata.questions.length;
            index++
          ) {
            this.onQuestionsSubmission();
            this.answers[index - 1][0].question =
              details.form_metadata.questions[index].body;
            this.answers[index - 1][1].text =
              details.form_metadata.questions[index].answers[0].text;
            this.answers[index - 1][1].desired =
              details.form_metadata.questions[index].answers[0].desired;
            this.answers[index - 1][2].text =
              details.form_metadata.questions[index].answers[1].text;
            this.answers[index - 1][2].desired =
              details.form_metadata.questions[index].answers[1].desired;
          }
        }
      }
    },
    answers(answers) {
      if (answers.length == 0) {
        this.addedQuestioinsErr = false;
      }
    },
  },
  methods: {
    ...mapActions("compliance", [
      "createCompliance",
      "updateComplianceAction",
      "complianceDetails",
    ]),
    onQuestionsSubmission() {
      if (
        this.form.yesStatement &&
        this.form.noStatement &&
        !this.addedQuestioinsErr
      ) {
        let quizObject = [
          { question: null },
          {
            desired: true,
            text: "",
            yesAnswer: true,
          },
          {
            desired: false,
            text: "",
            yesAnswer: false,
          },
        ];
        this.writtenQuestions(quizObject);
        this.showErr = false;
      } else {
        this.showErr = true;
      }
    },
    handleComplianceType() {
      switch (this.form.type) {
        case "questionnaire":
          return "questionnaire";
        case "agreement":
          return "agreement";
        case "Document - Vaccine/PCR":
          return "vaccine_document";
        default:
          "";
      }
    },
    onSubmit() {
      this.submitted = true;
      this.$v.$touch();
      if (
        this.$v.$invalid ||
        (!this.form.yesChecked && !this.form.noChecked) ||
        this.addedQuestioinsErr
      ) {
        return;
      } else {
        let entity = store.getters["authfack/currentEntity"];
        let questions =
          this.form.type == "questionnaire" || this.form.type == "agreement"
            ? [
                {
                  answers: [
                    {
                      desired: this.form.yesChecked,
                      text: this.form.yesStatement,
                      yesAnswer: true,
                    },
                    {
                      desired: this.form.noChecked,
                      text: this.form.noStatement,
                      yesAnswer: false,
                    },
                  ],
                  body:
                    this.form.type == "agreement"
                      ? this.form.agreementTxt
                      : this.form.questionInput,
                  type: this.handleComplianceType(),
                },
              ]
            : [
                {
                  answers: [
                    {
                      desired: this.form.yesChecked,
                      text: this.vaccine.uploadedStatement,
                      yesAnswer: true,
                    },
                    {
                      desired: this.form.noChecked,
                      text: this.vaccine.notUploadedStatement,
                      yesAnswer: false,
                    },
                  ],
                  bind: this.vaccine.document_binding,
                  protocols: this.printProtocolsArr,
                  pcr: this.vaccine.pcr
                    ? { days: this.vaccine.validationDays }
                    : null,
                  type: this.handleComplianceType(),
                },
              ];
        let answers2 = this.answers;
        if (answers2.length > 0) {
          for (let i = 0; i < answers2.length; i++) {
            questions.push({
              answers: [
                {
                  desired: answers2[i][1].desired,
                  text: answers2[i][1].text,
                  yesAnswer: true,
                },
                {
                  desired: answers2[i][2].desired,
                  text: answers2[i][2].text,
                  yesAnswer: false,
                },
              ],
              body: answers2[i][0].question,
              type: this.form.type,
            });
          }
        }
        let submittedForm =
          this.form.type == "questionnaire" || this.form.type == "agreement"
            ? {
                name: this.form.name,
                entity_id: entity.id,
                type: this.form.type,
                questions,
              }
            : {
                entity_id: entity.id,
                name: this.form.name,
                type: this.handleComplianceType(),
                data: questions,
                bind: this.vaccine.document_binding,
                pcr: this.vaccine.pcr
                  ? { days: this.vaccine.validationDays }
                  : null,
              };
        this.$route.name == "updateCompliance"
          ? this.updateComplianceAction({
              id: this.getComplianceDetails.id,
              form: submittedForm,
            })
          : this.createCompliance(submittedForm);
      }
    },
    writtenQuestions(questions) {
      this.answers.push(questions);
    },
    deleteQuestion(index) {
      this.answers.splice(index, 1);
    },
    getProtocolsValueOnUpdate(arr) {
      return (
        arr &&
        arr.length > 0 &&
        arr.map((protocol) => {
          switch (protocol) {
            case "nhs":
              return "NHS (Domestic/International)";
            case "eu":
              return "EU Digital COVID Certificate";
            case "shc":
              return "Smart Health Card (SHC)";
            case "nys":
              return "NYS Excelsior Pass & NYS Excelsior Pass Plus";
            default:
              return;
          }
        })
      );
    },
    setAddedQuestioinsErr(status) {
      this.addedQuestioinsErr = status;
    },
  },
  beforeMount() {
    this.complianceDetails(this.$route.params.id);
  },
};
</script>

<style lang="scss">
#createCompliance {
  margin-bottom: 6rem;
  li {
    list-style: none;
  }
  .quiz-btns-box {
    justify-content: center;
    margin-top: 30px;
    align-items: center;

    button {
      margin-right: 15px;
      margin-bottom: 10px;
      text-transform: uppercase;
      margin: 0 auto;
      color: #103f5e;
      font-weight: 600;
      background: transparent;
      border: none;
    }
  }

  .quiz-container {
    margin-top: 24px;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .comp-checkbox {
      label.custom-control-label {
        &::before {
          border-radius: 5 !important;
        }
      }

      margin-right: 20px;

      @media only screen and (max-width: 500px) {
        margin-right: 15px;
      }
    }

    .comp-input-container {
      position: relative;
      width: 100%;

      label {
        top: -11px;
        left: 20px;
        position: absolute;
        background-color: #fff;
        padding: 0 10px;
        margin: 0;
        z-index: 10;
      }

      input {
        height: 36px;
        width: 100%;
        border: 1px solid #ced4da;
      }
    }
  }
  .card-title {
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize;
    letter-spacing: 0.15px;
  }
  .card-subtitle {
    color: #74788d;
    letter-spacing: 0.25px;
    line-height: 16px;
    font-size: 16px;
    margin: 0px 10px 5px 0px;
    text-transform: uppercase;
  }
  .form-width {
    @media only screen and (max-width: 900px) {
      width: 80%;
    }

    @media only screen and (max-width: 670px) {
      width: 100% !important;
    }
  }
  .card-form {
    width: 95%;
    margin: 0 auto;

    @media only screen and (max-width: 900px) {
      width: 80%;
    }

    @media only screen and (max-width: 670px) {
      width: 100%;
    }
  }
  .comp-subtitle {
    font-size: 14px;
  }
  .form-group input {
    width: 100%;
    height: 36px;
  }
  #agreement-txt {
    height: 130px;
    resize: none;
  }
  #desired-answer {
    width: 56px;
    height: 24px;
  }
  .submit-btn-container {
    margin-top: 40px;
    justify-content: center;
    text-align: center;
  }
  .secondary-title {
    color: #103f5e;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    line-height: 12px;
    letter-spacing: 0.75px;
    margin: 30px 5px 40px 0;
  }
  .compliance-ques-table {
    word-break: break-all;
    width: 100%;
    margin-left: 10px;

    @media only screen and (max-width: 670px) {
      margin-left: 0px;
      display: flex;
      flex-direction: column !important;
    }

    tr {
      border-bottom: 1px solid #f6f6f6;
      width: 100%;
    }

    td {
      padding: 15px 0;
    }

    th,
    .th {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0.25px;
      padding-bottom: 10px;
      text-transform: capitalize;
    }
  }
  .compliance-ques-table tr:last-child {
    border-bottom: none !important;
  }
  .form-group label {
    font-size: 14px;
  }
  .individual-quiz {
    @media only screen and (max-width: 670px) {
      flex-direction: column !important;
      padding: 10px;
    }

    span {
      @media only screen and (max-width: 670px) {
        margin-bottom: 9px;
      }
    }
  }
  .question-text {
    text-transform: capitalize;
    color: #343a40;
  }
  .question-preview {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
  .show-desktop {
    @media only screen and (max-width: 670px) {
      display: none;
    }
  }

  .show-mobile {
    @media only screen and (min-width: 670px) {
      display: none;
    }
  }

  .checkbox-input {
    max-width: 40px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .card-body {
    @media only screen and (max-width: 670px) {
      padding: 20px 14px !important;
    }
  }
  .err-font {
    font-size: 0.8rem;
  }
}
</style>
