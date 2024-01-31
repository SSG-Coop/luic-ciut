// © Copyright 2023, LUIC-CIUT's Contributors
import i18n from '@/plugins/i18n';
import appConfig from "@/config/appConfig";

// rules for field validation
export default function ruleUtils() {
  const t = i18n.global.t;
  const allRules = {
    requiredRule: (fieldName) => {
      return [(v) => !!v || t('forms.validation.requiredField', {fieldName: fieldName})];
    },

    requiredNumberRule: (fieldName) => {
      return [
        (v) => Number(v) === parseFloat(v) || t('forms.validation.fieldNumber', {fieldName: fieldName}),
      ];
    },

    requiredPositiveRule: (fieldName) => {
      return [(v) => Number(v) > 0 || t('forms.validation.fieldPositive', {fieldName: fieldName})];
    },

    requiredPercentRule: (fieldName) => {
      return [
        (v) =>
          Number(v) <= 100 || t('forms.validation.fieldLT100Percent', {fieldName: fieldName}),
        (v) =>
          Number(v) >= 0 ||
          t('forms.validation.fieldGT0Percent', {fieldName: fieldName}),
      ];
    },

    startYearRule: [
      (v) => !!v || t("forms.validation.startYearRequired"),
      (v) => Number(v) === parseFloat(v) || t("forms.validation.startYearNumber"),
      (v) => Number.isInteger(parseFloat(v)) || t("forms.validation.startYearInteger"),
      (v) =>
        parseFloat(v) >= appConfig().startYear ||
        t("forms.validation.startYearRange", { startYear: appConfig().startYear, endYear: appConfig().endYear }),
      (v) =>
        parseFloat(v) <= appConfig().endYear ||
        t("forms.validation.startYearRange", { startYear: appConfig().startYear, endYear: appConfig().endYear }),
    ],

    emailRule: [
      (v) => !!v || t("forms.validation.emailRequired"),
      (v) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(v) || t("forms.validation.emailValid");
      },
    ],

    max50Rule: [
      (value) => (value && value.length <= 50) || t("forms.validation.max50chars"),
    ],
  };

  /**
   * returns list of rules
   * @param {[string]} rules - list of rules to get
   */
  const getRules = (rules) => {
    return Object.keys(allRules)
      .filter((key) => rules.includes(key))
      .reduce(
        (filteredRules, key) => (
          (filteredRules[key] = allRules[key]), filteredRules
        ),
        {}
      );
  };

  return {
    allRules,
    getRules,
  };
}
