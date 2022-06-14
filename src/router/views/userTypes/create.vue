<template>
  <Layout>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between mb-2"
    >
      <b-button
        pill
        @click="onRootParentChange('', null, null)"
        class="d-flex align-items-center px-4"
        variant="primary"
        size="md"
        >
        New User Type
      </b-button
      >
    </PageHeader>
    <Alert
      :message="this.$store.state.notification.message"
      :type="this.$store.state.notification.type"
      :show="this.$store.state.notification.show"
    />
    <section id="userTypeLayout" class="flex-row">
      <!-- selection card -->
      <SelectionCard
        :isLoading="getLoading"
        :optionlist="getParentsList"
        :onSelection="onRootParentChange"
        :activeIndex="activeIndex"
      />
      <!-- form card -->
      <div
        class="form-side"
        ref="autoScroll"
        v-if="parentId !== null || isCreateNewOpen"
      >
        <FormCard
          :parentTypes="getParentsList"
          :mode="isCreateNewOpen ? 'create' : 'update'"
          :parentId="parentId"
          :parentName="parentName"
          :formTitle="parentId ? `${parentName} as Parent UserType` : 'Create New UserType' "
        />
      </div>
      <div v-else class="create-new-type">
        <h4 class="create-invitation">Please select “Current User Type” as a parent or click “New User Type” button above:</h4>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Alert from "@/components/sharedCells/alert";
import FormCard from "./formCard";
import SelectionCard from "./selectionCard";
import { mapActions, mapGetters } from "vuex";

export default {
  title:"User Type Form",
  name: "CreateUserType",
  components: {
    Layout,
    PageHeader,
    Alert,
    FormCard,
    SelectionCard,
  },
  beforeMount() {
    this.fetchParentsList();
  },
  watch: {
    parentId: function(val) {
      if (val !== null) {
        this.isCreateNewOpen = false;
        this.$refs.autoScroll?.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
  data() {
    return {
      title: "Current User Types",
      activeIndex: undefined,
      parentId: null,
      parentName: null,
      isCreateNewOpen: false,
    };
  },
  computed: {
    ...mapGetters("userType", ["getParentsList", "getLoading"]),
  },
  methods: {
    ...mapActions("userType", ["fetchParentsList"]),
    onRootParentChange(id, name, index) {
      this.parentId = id;
      this.parentName = name;
      this.activeIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
#userTypeLayout {
  flex-wrap: wrap;
  gap: 25px 45px;
  margin-top: 19px;
  @media only screen and (max-width: 670px) {
    flex-direction: column;
  }
  .create-invitation {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
  }
  .form-side {
    animation: slide-in-anim 0.7s backwards ease;
    -webkit-animation: slide-in-anim 0.7s backwards ease;
    width: 60%;
    @media only screen and (max-width: 670px) {
      width: 100%;
    }
  }
  @keyframes slide-in-anim {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .create-new-type {
    height: 400px;
    padding: 20px;
  }
}
</style>
