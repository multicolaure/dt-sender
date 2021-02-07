<template>
  <section class="main">
    <h2 class="text-md text-right">{{ emails.length }} emails à envoyer</h2>
    <div class="flex flex-wrap justify-around">
      <EmailPreview :email="email" v-for="email in emails" :key="email.recipient" :emailBody="emailConfig.message"/>
    </div>
  </section>
  <aside class="aside bg-white">
      <EmailConfigurator 
      @send="onSend"
      @saveConfig="onSaveConfig" 
      :config="emailConfig"
      @emailBodyChange="onEmailBodyChange"/>
  </aside>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import EmailConfigurator from '../components/email/EmailConfigurator.vue';
import EmailPreview from '../components/email/EmailPreview.vue';
import { Email, EmailConfiguration } from '../model';
import { fetchPreferredConfig, savePreferredConfig, getDefaultEmailBody } from '../service';

export default defineComponent({
  name: 'App',
  components: {
    EmailConfigurator,
    EmailPreview,
  },
  props: {
    emails: {
      type: Object as PropType<Array<Email>>,
      required: true,
    },
    code: {
      type: String,
      required: true,
    }
  },
  emits: ['send'],
  data() {
    return {
      emailConfig: {
        email: '',
        message: ''
      },
    }
  },
  created() {
    this.emailConfig = fetchPreferredConfig();
    if(!this.emailConfig.message) {
      this.emailConfig.message = getDefaultEmailBody(this.code);
    }
  },
  methods: {
    onSend(emailConfig: EmailConfiguration) {
      this.$emit('send', emailConfig);
    },
    onSaveConfig(emailConfig: EmailConfiguration) {
      savePreferredConfig(emailConfig);
    },
    onEmailBodyChange(emailBody: string) {
      this.emailConfig.message = emailBody;
    }
  },
});
</script>
