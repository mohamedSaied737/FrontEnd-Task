<template>
  <div>
    <b-form
      class="pb-2 pt-0 description-form"
      @submit.prevent="
        onDescriptionSubmission(
          insertedText,
          elementData,
          mainData.map((el) => el.id).indexOf(elementData.id)
        )
      "
    >
      <b-form-input
        type="text"
        v-model="insertedText"
        placeholder="Description..."
      />
    </b-form>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      insertedText: "",
    };
  },
  props: ["onDescriptionSubmission", "elementData", "mainData"],
};
</script>