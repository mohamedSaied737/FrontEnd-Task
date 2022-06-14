<template>
  <b-pagination
    v-model="currentPage"
    pills
    :total-rows="rows"
    align="center"
  ></b-pagination>
</template>
<script>
export default {
  name: "Pagination",
  data() {
    return {
      rows: 100,
      currentPage: 3,
    };
  },
};
</script>
