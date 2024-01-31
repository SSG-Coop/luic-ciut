<template>
  <v-container>
    <v-form v-model="valid" ref="form">
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            v-model="title"
            :label="$t('forms.fields.scenarioTitle')"
            variant="outlined"
            :rules="requiredRule($t('forms.fields.scenarioTitle'))"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="description"
            :label="$t('forms.fields.scenarioDescription')"
            auto-grow
            variant="outlined"
            rows="4"
            :rules="requiredRule($t('forms.fields.scenarioDescription'))"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedRegion"
            variant="outlined"
            :items="allProvinces"
            item-title="name"
            item-value="id"
            :label="$t('forms.fields.province')"
            menu-icon="$caretDown"
            :rules="requiredRule($t('forms.fields.province'))"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="selectedYear"
            :label="$t('forms.fields.buildOutYear')"
            type="number"
            variant="outlined"
            :rules="startYearRule"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedNeighbourhood"
            variant="outlined"
            :items="allNeighbourhoods"
            item-title="name"
            item-value="id"
            :label="$t('forms.fields.neighbourhoodType')"
            menu-icon="$caretDown"
            :rules="requiredRule($t('forms.fields.neighbourhoodType'))"
          />
        </v-col>
        <v-col v-if="selectedNeighbourhood !== ''">
          <v-card color="lightBg">
            <template v-slot:text>
              <scenario-header-snippet
                :neighbourhood-type="selectedNeighbourhood"
              ></scenario-header-snippet>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, onBeforeMount, defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";
import regionsConfig from "@/config/regions.js";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";
import ruleUtils from "@/utils/ruleUtils.js";
import ScenarioHeaderSnippet from "@/components/ScenarioHeaderSnippet.vue";

export default defineComponent({
  name: "ScenarioFormStepInfo",

  props: {
    scenario: {
      type: Object,
      required: true,
    },
  },

  components: { ScenarioHeaderSnippet },

  emits: ["on-validated", "on-error"],

  setup(props, { emit }) {
    const form = ref();
    const title = ref("");
    const description = ref("");
    const id = ref("");
    const allProvinces = regionsConfig().getProvinceNamesIdsAsArray();
    const selectedRegion = ref("");
    const selectedYear = ref("");
    const allNeighbourhoods =
      neighbourhoodTypesConfig().getNeighbourhoodNamesIdsAsArray();
    const selectedNeighbourhood = ref("");

    onBeforeMount(() => {
      // set some data
      // todo load data from props when loading existing scenarios
      id.value = uuidv4();
    });

    /**
     * populate the form fields from a saved scenario
     */
     const populate = () => {
      const fields = [
        // list of fields to be populated in the form:
        [id, 'id'],
        [title, 'title'],
        [description, 'description'],
        [selectedRegion, 'provId'],
        [selectedYear, 'year'],
        [selectedNeighbourhood, 'neighbourhoodType'],
      ];
      fields.forEach((_fld) => {
        _fld[0].value = props.scenario[_fld[1]];
      });
    };

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();
    const submitted = ref(false);

    /**
     * validate form and emit data if validation passes
     */
    const validate = () => {
      form.value.validate();
      if (valid.value === true) {
        emitData();
      } else {
        submitted.value = true;
        emit("on-error");
      }
    };
    /**
     * emit the form data
     */
    const emitData = () => {
      const scenario = {
        title: title.value,
        id: id.value,
        description: description.value,
        provId: selectedRegion.value,
        year: parseInt(selectedYear.value),
        neighbourhoodType: selectedNeighbourhood.value,
        datetimeCreated: Date.now(),
        datetimeModified: Date.now(),
      };

      emit("on-validated", scenario);
    };

    return {
      form,
      id,
      title,
      description,
      allProvinces,
      selectedRegion,
      selectedYear,
      allNeighbourhoods,
      selectedNeighbourhood,
      valid,
      submitted,
      ...ruleUtils().getRules(["requiredRule", "startYearRule"]),
      validate,
      populate,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>