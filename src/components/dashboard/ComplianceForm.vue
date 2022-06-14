<template>
  <div class="row" id="complienceForm">
    <div class="col-12">
      <div
        class="form-group mb-2 question-wrapper py-1 border-bottom"
        v-for="(question, i) in element.pivot"
        :key="i"
      >
      <div class="agreement" v-if="question.type == 'agreement'">
      <span class="text-muted answer-text">{{question.type}} {{element.name}}</span>
      <p class="text-primary question-text mb-0">{{question.body}}</p>
      </div>
        <!-- Question -->

        <div v-else>
        <span class="answer-text text-muted">{{i + 1}}</span>
        <span class="answer-text text-muted mx-2">{{question.type}} {{element.name}}</span>
        <p class="text-primary question-text mb-0">{{question.body}}</p>
        </div>
        <!-- Answer  -->
       <div v-if="Array.isArray(question.answer)" class="both">
         <ul class="answers px-3">
           <li v-for="(answer,i) in question.answer" :key="i" class="answer-text mb-0">{{answer.text}}</li>
         </ul>
       </div>
       <div v-else>
          <ul class="answers px-3">
           <li class="answer-text">{{question.answer.text}}</li>
         </ul>
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
  .label-text{
    font-size: 0.8rem;
  }
  .question-text {
    font-size: 1.1rem;
  }
  .answer-text{
    font-size: 0.9rem;
  }
  .answers{
    list-style: circle;
  }
}
</style>
