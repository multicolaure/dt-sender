<template>
  <span class="cursor-pointer">
    <a href="#" @click.prevent="openDialog" class="link"><slot></slot></a>
    <input
      ref="input"
      type="file"
      name="attachment"
      @change="startUpload"
      class="cursor-pointer hidden"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DropFileLink',
  emits: ['upload'],
  methods: {
    startUpload(event: any) {
      this.$emit('upload', event.target.files[0]);
    },
    openDialog() {
      (this.$refs.input as HTMLElement).click();
    }
  },
});
</script>
