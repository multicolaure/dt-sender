<template>
  <section class="card m-8">
    <header class="card-header">
      <h3>{{ email.recipient }}</h3>
      <h2 class="font-normal">{{ email.subject }}</h2>
    </header>
    <div class="card-body" v-html="cleanEmailBody"></div>
    <div class="card-footer">
      <ul class="flex flex-col text-teal-600">
        <li v-for="attachment in email.attachments" :key="attachment">
          <svg
            class="w-6 h-6 inline"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clip-rule="evenodd"
            />
          </svg>
          {{ attachment }}
        </li>
      </ul>
    </div>
    
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Email } from '../../model';

export default defineComponent({
  name: 'EmailPreview',
  props: {
    email: {
      type: Object as PropType<Email>,
      required: true,
    },
    emailBody: {
      type: String,
      required: true,
    }
  },
  computed: {
    cleanEmailBody(): string {
      return this.emailBody.replaceAll('\n', '<br>');
    },
  },
});
</script>
