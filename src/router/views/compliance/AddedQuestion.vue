<template>
  <div id="QuizContainer" v-if="type === 'questionnaire'">
    <div class="flex-row upper-row">
      <h4>
        Question <strong>{{ index + 2 }}</strong>
      </h4>
      <div class="action-btns-box flex-row">
        <i class="mdi mdi-delete" @click="deleteQuestion(index)"></i>
      </div>
    </div>
    <div>
      <!-- Questionnaire selected -->
      <div>
        {{ checkValidation() }}
        <!-- Question -->
        <b-form-group id="question-group" label="" label-for="questionInput">
          <b-form-input
            id="questionInput"
            v-model="element[0].question"
            type="text"
            placeholder="Enter Your Question"
          >
          </b-form-input>
          <p
            class="text-danger err-font mb-0"
            v-if="submitted && !element[0].question"
          >
            Question is required
          </p>
          <p
            class="text-danger err-font mb-0"
            v-else-if="
              submitted && element[0].question && element[0].question.length < miniQuestionLength
            "
          >
            The mminimum length is {{ miniQuestionLength }} characters
          </p>
          <p
            class="text-danger err-font mb-0"
            v-else-if="
              submitted &&
              element[0].question &&
              element[0].question.length > maxQuestionLength
            "
          >
            The Maximum length is {{ maxQuestionLength }} characters
          </p>
        </b-form-group>
      </div>
      <h5 class="comp-subtitle">Desired Answer:</h5>
      <div class="quiz-container flex-row">
        <b-form-checkbox class="comp-checkbox" v-model="element[1].desired" />
        <div class="comp-input-container">
          <label for="yesState">Positive Answer</label>
          <b-form-input
            class="compliance-custom-input"
            v-model="element[1].text"
            id="yesState"
            placeholder="Statement"
            :maxlength="maxAnswerLength+1"
          />
          <p
            class="text-danger err-font mb-0"
            v-if="submitted && !element[1].text"
          >
            Answer is required
          </p>
          <p
            class="text-danger err-font mb-0"
            v-else-if="
              submitted && element[1].text && element[1].text.length > maxAnswerLength
            "
          >
            The Mminimum length is {{maxAnswerLength}} characters
          </p>
        </div>
      </div>
      <div class="quiz-container flex-row">
        <b-form-checkbox class="comp-checkbox" v-model="element[2].desired" />
        <div class="comp-input-container">
          <label for="noState">Negative Answer</label>
          <b-form-input
            class="compliance-custom-input"
            v-model="element[2].text"
            id="noState"
            placeholder="Statement"
            :maxlength="maxAnswerLength+1"
          />
          <p
            class="text-danger err-font mb-0"
            v-if="submitted && !element[2].text"
          >
            Answer is required
          </p>
          
          <p
            class="text-danger err-font mb-0"
            v-else-if="
              submitted && element[2].text && element[2].text.length > maxAnswerLength
            "
          >
            The Mminimum length is {{maxAnswerLength}}  characters
          </p>
        </div>
      </div>
      <p
        class="text-danger mt-2 err-font"
        v-if="!this.element[1].desired && !this.element[2].desired"
      >
        At least one answer should be checked
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "element",
    "index",
    "deleteQuestion",
    "type",
    "setAddedQuestioinsErr",
    "submitted",
  ],
  data() {
    return {
      questionErr: false,
      positiveCheck: false,
      negativeCheck: false,
      positiveText: false,
      negativeText: false,
      maxAnswerLength: 27,
      maxQuestionLength: 2000,
      miniQuestionLength: 5,
    };
  },
  methods: {
    checkValidation() {
      if (
        !this.element[0].question ||
        this.element[0].question.length < 5 ||
        this.element[0].question.length > 2000 ||
        !this.element[1].text ||
        this.element[1].text.length > 27 ||
        !this.element[2].text ||
        this.element[2].text.length > 27 ||
        (!this.element[1].desired && !this.element[2].desired)
      ) {
        this.setAddedQuestioinsErr(true);
      } else {
        this.setAddedQuestioinsErr(false);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#QuizContainer {
  position: relative;
  padding: 30px 20px;
  margin-top: 30px;
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  h4 {
    font-size: 15px;
    font-weight: 500;
  }
  .upper-row {
    justify-content: space-between;
  }
  .action-btns-box i {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.38);
    cursor: pointer;
    &:hover {
      color: #103f5e;
    }
  }
}
</style>
