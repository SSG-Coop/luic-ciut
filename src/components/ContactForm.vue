<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-alert
          dense
          border="start"
          type="success"
          v-model="displaySuccessMsg"
          icon="$check"
          transition="slide-y-reverse-transition"
          class="mb-8"
        >
          {{ $t("forms.confirmMsgSent") }}
        </v-alert>
        <v-alert
          dense
          border="start"
          type="warning"
          v-model="displayFormError"
          icon="$exclamationTriangle"
          transition="slide-y-reverse-transition"
          class="mb-8"
        >
          {{ formErrorMsg }}
        </v-alert>
        <v-form ref="form" v-model="formValid" @submit="submit">
          <v-text-field
            :disabled="displaySuccessMsg"
            variant="outlined"
            :label="$t('forms.fields.email')"
            v-model="email"
            :rules="emailRule"
            prepend-inner-icon="$envelope"
          ></v-text-field>
          <v-text-field
            :disabled="displaySuccessMsg"
            variant="outlined"
            :label="$t('forms.fields.name')"
            v-model="name"
            :rules="requiredRule($t('forms.fields.name'))"
            prepend-inner-icon="$user"
          ></v-text-field>
          <v-textarea
            :disabled="displaySuccessMsg"
            variant="outlined"
            :label="$t('forms.fields.message')"
            v-model="message"
            :rules="requiredRule($t('forms.fields.message'))"
            rows="10"
            class="mb-4"
          ></v-textarea>
          <v-btn
            color="info"
            @click="submit"
            :loading="formProcessing"
            class="mr-16"
          >
            {{ $t("forms.send") }}
          </v-btn>
          <v-btn text @click="reset" :disabled="formProcessing">
            {{ $t("forms.reset") }}
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, ref, inject } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import ruleUtils from "@/utils/ruleUtils.js";

export default defineComponent({
  name: "ContactForm",

  setup() {
    const { t } = useI18n();
    const form = ref();
    const formValid = ref(true);
    const formProcessing = ref(false);
    const email = ref("");
    const name = ref("");
    const message = ref("");
    const displaySuccessMsg = ref(false);
    const displayFormError = ref(false);
    const formErrorMsg = ref("");
    const mailerUrl = inject("WebformMailer");
    const mailerKey = inject("WebformMailerKey");

    const clearFormError = () => {
      formErrorMsg.value = "";
      displayFormError.value = false;
    };

    const submit = () => {
      form.value.validate();
      if (formValid.value) {
        clearFormError();
        formProcessing.value = true;
        const mailer = axios.create({
          baseURL: mailerUrl,
          headers: {
            "x-api-key": mailerKey,
          },
        });
        const body = {
          name: name.value,
          email: email.value,
          message: message.value,
        };
        mailer
          .post("/", body)
          .then(() => {
            displaySuccessMsg.value = true;
            formProcessing.value = false;
          })
          .catch(() => {
            formProcessing.value = false;
          });
      } else {
        formErrorMsg.value = t("forms.errorAlert");
        displayFormError.value = true;
      }
    };

    const reset = () => {
      [email, name, message].forEach((fld) => {
        fld.value = "";
      });
      displaySuccessMsg.value = false;
      displayFormError.value = false;
      formValid.value = true;
      form.value.reset();
    };

    return {
      form,
      formValid,
      formProcessing,
      email,
      name,
      message,
      displaySuccessMsg,
      displayFormError,
      formErrorMsg,
      submit,
      reset,
      ...ruleUtils().getRules(["requiredRule", "emailRule"]),
    };
  },
});
</script>
<style lang="scss" scoped></style>
