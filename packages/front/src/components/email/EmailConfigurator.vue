<template>
  <form @submit.prevent="onSend()">
    <div class="flex flex-col space-y-5">
      <label class="form-label"
        ><span>Email de réponse *</span>
        <input
          type="email"
          name="email"
          required
          class="form-input"
          :value="config.email"
          @input="this.email = $event.target.value"
        />
      </label>
      <label class="form-label">
        <span>Message *</span>
        <textarea 
          rows="7"
          class="form-input"
          required
          :value="config.message"
          @input="this.message = $event.target.value; this.emailBodyChange($event.target.value)"
        ></textarea>
      </label>
      <label class="form-label-checkbox">
        <input type="checkbox" v-model="saveConfig"><span>Enregistrer ses informations sur mon ordinateur</span>
      </label>
      <button
        type="submit"
        class="btn btn-primary"
      >
        Envoyer
      </button>
    </div>
  </form>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmailConfigurator',
  props: {
    config: {
      required: true,
    },
  },
  data() {
    return {
      email: '',
      message: '',
      saveConfig: true,
    };
  },
  emits: ['send', 'saveConfig', 'emailBodyChange'],
  methods: {
    onSend() {
      const emailConfig = {
        email: this.email,
        message: this.message,
      };
      this.$emit('send', emailConfig);
      if(this.saveConfig) {
        this.$emit('saveConfig', emailConfig);
      }
    },
    emailBodyChange(emailBody) {
      this.$emit('emailBodyChange', emailBody);
    }
  }

});
</script>
