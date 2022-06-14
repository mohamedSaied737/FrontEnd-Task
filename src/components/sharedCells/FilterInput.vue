<template>
  <div class="d-flex align-items-center justify-content-center">
    <b-form-input
      v-if="type == 'default'"
      class="default-input"
      v-model="selected"
      :placeholder="placeholder"
    >
    </b-form-input>
    <!-- single select  -->
    <multiselect
      v-if="type == 'selectInput'"
      class="mt-1 no-wrap"
      v-model="selected"
      :label="label"
      :trackBy="label"
      :options="options ? options : []"
      :placeholder="placeholder"
      :show-labels="false"
      @open="onOpen"
      openDirection="bottom"
      :style="onSingleSelectStyle()"
      :closeOnSelect="true"
    >
    </multiselect>
    <!-- multi select  -->
    <multiselect
      v-if="type == 'multiSelect'"
      multiple
      class="mt-1"
      v-model="selected"
      :label="label"
      :trackBy="label"
      :options="options ? options : []"
      :placeholder="placeholder"
      :show-labels="false"
      @open="onOpen"
      openDirection="bottom"
      :style="
        Array.isArray(selected) && selected.length > 0 && selected.length <= 1
          ? 'min-width:150px'
          : Array.isArray(selected) &&
            selected.length > 1 &&
            selected.length <= 2
          ? 'width:300px'
          : Array.isArray(selected) &&
            selected.length > 2 &&
            selected.length <= 3
          ? 'width:400px'
          : Array.isArray(selected) &&
            selected.length > 3 &&
            selected.length <= 4
          ? 'width:500px'
          : 'min-width:120px'
      "
      :closeOnSelect="true"
    >
      <template
        v-if="paramsKey.valueKey == 'UserType'"
        slot="option"
        slot-scope="props"
      >
        <div class="option__desc">
          <span
            v-if="props.option.children"
            class="option__name font-weight-bold"
            >{{ props.option.name }}</span
          >
          <span v-else class="option__usertype__child font-weight-bold ml-2">
            - {{ props.option.name }}</span
          >
        </div>
      </template>
    </multiselect>
    <date-picker
      v-if="type == 'dateInput'"
      v-model="selected"
      range
      append-to-body
      lang="en"
      value-type="YYYY-MM-DD"
      format="YYYY-MM-DD"
      placeholder="filter"
      :clearable="false"
      range-separator=""
      style="min-width: 120px"
    >
      <i
        slot="icon-calendar"
        :class="
           selected
            ? ''
            : 'mdi mdi-calendar text-muted'
        "
      >
      </i>
    </date-picker>
    <!-- tempreture filter  -->
    <div
      :class="showTempretureSlider && 'border py-1 px-3'"
      v-if="type == 'tempretureSlider'"
    >
      <b-form-input
        style="width: 120px"
        v-if="!showTempretureSlider"
        class="default-input tempreture-value"
        v-model="tempretureInput"
        :placeholder="placeholder"
        @click="onTempretureClick"
      >
      </b-form-input>
      <b-slider
        style="width: 150px"
        v-if="showTempretureSlider"
        v-model="numbers"
        :min="getSelectedTempreture == 'f' ? 95 : 34"
        :max="getSelectedTempreture == 'f' ? 100 : 40"
        :step="0.1"
        :ticks="false"
        :rounded="true"
        :tooltip-always="false"
        :bigger-slider-focus="false"
        :indicator="false"
        size="is-small"
        lazy
        @change="onTempretureChange"
      >
      </b-slider>
      <div class="d-flex justify-content-center">
        <button
          class="btn btn-outline-secondary btn-sm mr-2"
          v-if="showTempretureSlider"
          @click.prevent="onTempretureCancel"
        >
          hide
        </button>
        <button
          v-if="showTempretureSlider"
          class="btn btn-outline-primary btn-sm"
          @click="onConfirmTempreture"
        >
          Confirm
        </button>
      </div>
    </div>
    <i
      v-if="selected"
      class="mdi mdi-close-thick mx-1 clear-icon"
      @click="clearFilter"
    ></i>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
export default {
  name: "FilterInput",
  components: {
    multiselect,
    DatePicker,
  },
  props: [
    "label",
    "options",
    "placeholder",
    "openAction",
    "selectAction",
    "paramsKey",
    "type",
    "defaultSelected",
    "iconType",
  ],
  data() {
    return {
      selected: null,
      tempretureInput: null,
      numbers: [34, 40],
      showTempretureSlider: false,
    };
  },
  computed: {
    ...mapGetters("grid", ["getFilterValues", "getSelectedTempreture"]),
  },
  watch: {
    selected(value) {
      if (Array.isArray(value) && value.length == 0) {
        this.clearFilter();
      } else if (value === "") {
        this.clearFilter();
      } else {
        value &&
          this.onSetFilterValue({
            [this.paramsKey.valueKey]:
              this.type == "default"
                ? value
                : this.type == "dateInput"
                ? {
                    start: `${value[0]} 00:00:00`,
                    end: `${value[1]} 23:59:59`,
                  }
                : this.type == "multiSelect" && value.length > 0
                ? value.map((type) => type.id)
                : value.id
                ? value.id
                : value,
          });
        this.selectAction();
      }
    },
    getSelectedTempreture(value) {
      if (value == "f") {
        this.tempretureInput = null;
        this.numbers = [95, 100];
      } else {
        this.tempretureInput = null;
        this.numbers = [34, 40];
      }
    },
    checkInputWidth(value) {
      switch (value) {
        case Array.isArray(value) && value.length > 0:
          return "width : 150px";
        case Array.isArray(value) && value.length > 1:
          return "width : 300px";
        case Array.isArray(value) && value.length > 2:
          return "width : 400px";
        default:
          return "width : 80px";
      }
    },
  },
  methods: {
    ...mapActions("grid", ["onSetFilterValue", "onClearFilterValue"]),
    clearFilter() {
      this.onClearFilterValue(this.paramsKey.valueKey);
      this.selected = null;
      this.tempretureInput = null;
      this.showTempretureSlider = false;
      this.getSelectedTempreture == "f"
        ? (this.numbers = [95, 100])
        : (this.numbers = [34, 40]);
    },
    onOpen() {
      return this.openAction && this.openAction();
    },
    onTempretureCancel() {
      this.showTempretureSlider = false;
    },
    onTempretureClick() {
      this.showTempretureSlider = true;
    },
    onConfirmTempreture() {
      this.showTempretureSlider = false;
      this.selected = this.numbers;
    },
    onTempretureChange() {
      const { getSelectedTempreture, numbers } = this;
      const tempreture = numbers.map((item) =>
        getSelectedTempreture == "f" ? `${item} °F` : `${item} °C`
      );
      this.tempretureInput = tempreture.join(" - ");
    },
    onSingleSelectStyle(){
    switch (this.paramsKey.valueKey) {
      case 'vaccine_document':
      return 'min-width: 120px'
      case 'hasMask':
      return 'min-width: 120px'
      default:
      return 'min-width: 80px'
    }
    },
  },
  beforeMount() {
    this.selected = this.defaultSelected ? this.defaultSelected : null;
  },
};
</script>
<style lang="scss" scobed>
.clear-icon {
  font-size: 1.1rem;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: #f46a6a;
  }
}
.filter-icon {
  font-size: 1.5rem;
  color: #103f5e;
  cursor: pointer;
  &:hover {
    color: #f46a6a;
  }
}
.multiselect__tags {
  margin-top: 1px;
}
.default-input {
  width: 100px;
}
.tempreture-value {
  cursor: pointer;
}
</style>
