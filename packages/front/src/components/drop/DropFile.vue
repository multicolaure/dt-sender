<template>
  <div
    class="border-dashed border-4 border-neutral rounded relative bg-neutral-lighter"
  >
    <input
      type="file"
      name="attachment"
      @change="startUpload"
      class="cursor-pointer relative block opacity-0 w-full h-full p-60 z-50"
    />
    <div
      class="cursor-pointer text-center p-10 pt-5 h-full absolute top-0 right-0 left-0 m-auto text-primary flex flex-col items-center space-y-4 justify-center"
    >
      <Icon name="dropfile" size="8x"/>
      <h4 class="font-bold text-2xl">Déposez le fichier zip ici</h4>
      <p>ou</p>
      <p><span class="btn btn-primary">Sélectionnez le fichier</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../Icon.vue';

export default defineComponent({
  name: 'DropFile',
  emits: ['upload'],
  components: {
    Icon,
  },
  methods: {
    startUpload(event: any) {
      this.$emit('upload', event.target.files[0]);
    },
  },
});
</script>
