<template>
<div class="topbar">
  <div class="flex items-center">
    <a href="#" @click.prevent="backHome">
      <img src="./assets/logo.png" />
    </a>
    <a href="#" @click.prevent="backHome">
      <h1 class="text-2xl font-bold">René</h1>
    </a>
    <h2 class="text-md text-neutral">envoyez des demandes de travaux en un clic</h2>
  </div>
  <div><button class="p-3"><Icon name="github" size="lg"/></button></div>
</div>
<Upload v-if="currentPage === Page.UPLOAD" @uploaded="onUploaded" />
<Preview v-if="currentPage === Page.PREVIEW" :emails="emails" :code="code" @send="onSend" />

<teleport to="body">
  <Modal v-if="modalOpen"
    :message="modalMessage"
    :type="modalType" 
    :title="modalTitle" 
    :okButton="modalOkButton"
    @close="closeModal"
    @ok="nextStep" />
</teleport>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Email, EmailConfiguration } from './model';
import Upload from './pages/Upload.vue';
import Preview from './pages/Preview.vue';
import { preview, send } from './service';
import { default as Modal } from './components/feedback/Modal.vue';
import useFeedbacks from './composables/feedback';
import Icon from './components/Icon.vue';

export enum Page {
  UPLOAD,
  PREVIEW,
}

export enum Step {
  START,
  UPLOADED,
  SENT,
  ERROR,
  SUCCESS,
}

export default defineComponent({
  name: 'App',
  components: {
    Upload,
    Preview,
    Modal,
    Icon
  },
  data() {
    return {
      currentPage: Page.UPLOAD,
      currentStep: Step.START as Step,
      emails: [] as Array<Email>,
      code: undefined as string | undefined,
      zip: undefined as string | undefined,
      emailConfiguration: undefined as EmailConfiguration | undefined,
      Page,
    };
  },
  setup() {
    return {
      ...useFeedbacks(),
    }
  },
  methods: {
    onUploaded(file: any) {
      preview(file)
        .then(({emails, code}: {emails: Array<Email>, code: string}) => {
          this.zip = file;
          this.emails = emails;
          this.code = code;
          this.currentPage = Page.PREVIEW;
          this.currentStep = Step.UPLOADED;
        });
    },
    onSend(emailConfig: EmailConfiguration) {
      this.currentStep = Step.SENT;
      this.emailConfiguration = emailConfig;
      this.startLoading();
      send(this.zip, emailConfig)
      .then(() => {
        this.currentStep = Step.SUCCESS;
        this.success();
      })
      .catch((error) => {
        console.error(error);
        this.currentStep = Step.ERROR;
        this.handleError();
      });
    },
    reset() {
      this.emails = [];
      this.code = undefined;
      this.currentStep = Step.START;
    },
    backHome() {
      this.reset();
      this.currentPage = Page.UPLOAD;
    },
    nextStep() {
      this.closeModal();
      if(this.currentStep === Step.SUCCESS) {
        this.backHome();
      }
      if(this.currentStep === Step.ERROR) {
        if(this.emailConfiguration) {
          this.onSend(this.emailConfiguration);
        }
        else {
          this.backHome();
        }
      }
    }
  },
});
</script>
