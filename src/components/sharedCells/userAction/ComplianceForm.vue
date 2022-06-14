<template>
  <div class="row" id="complienceForm">
    <div class="col-12">
      <div class="form-group mb-3">
        <p class="font-weight-normal mb-1">
          {{
            element.type == "agreement"
              ? `Compliance Agreement ${element.name}`
              : `Compliance Questionnaire ${element.name}`
          }}
        </p>
        <span class="text-muted font-weight-normal mb-0 info"
          >Please ensure the user reads the following and understands fully before
          confirming below</span
        >
      </div>
      <div
        class="form-group mb-3 question-wrapper py-1"
        v-for="(question, i) in element.answer"
        :key="i"
      >
        <b-form-textarea
          v-if="question.type == 'agreement'"
          id="agreement-txt"
          type="text"
          :readOnly="true"
          :value="question.body"
          rows="5"
        >
        </b-form-textarea>
        <!-- Question -->
        <b-form-group
          v-else
          id="question-group"
          :label="`Question ${i + 1}`"
          label-for="questionInput"
          class="text-muted info"
        >
          <b-form-input
            id="questionInput"
            :value="`${question.body}`"
            type="text"
            :readOnly="true"
          >
          </b-form-input>
        </b-form-group>
        <!-- Yes -->
        <div class="quiz-container flex-row">
          <b-form-checkbox class="comp-checkbox" v-model="question.yesAnswer" :disabled="question.noAnswer"/>
          <div class="comp-input-container">
            <label for="yesStatement">Positive Answer</label>
            <b-form-input
              class="compliance-custom-input"
              v-model="question.answers[0].text"
              id="yesStatement"
              :readOnly="true"
            />
          </div>
        </div>
        <!-- No -->
        <div class="quiz-container flex-row">
          <b-form-checkbox class="comp-checkbox" v-model="question.noAnswer" :disabled="question.yesAnswer"/>
          <div class="comp-input-container">
            <label for="noStatement">Negative Answer</label>
            <b-form-input
              class="compliance-custom-input"
              :value="question.answers[1].text"
              id="noStatement"
              :readOnly="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["element", "index"],
};
</script>
<style lang="scss" scoped>
#complienceForm {
  .info {
    font-size: 0.9rem;
  }
  .quiz-container {
    margin-top: 24px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    .comp-checkbox {
      label.custom-control-label {
        &::before {
          border-radius: 0 !important;
        }
      }
      margin-right: 30px;
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
        height: 45px;
        width: 100%;
        border-radius: 0 !important;
        border: 1px solid #dddbda;
      }
    }
    ::placeholder {
      font-size: 15px;
      font-weight: 500;
      color: rgb(116, 115, 115);
    }
    ::-moz-placeholder {
      font-size: 15px;
      font-weight: 500;
      color: rgb(116, 115, 115);
    }
  }
}
</style>
