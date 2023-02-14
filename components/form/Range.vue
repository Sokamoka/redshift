<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },

  label: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <label :for="name" class="block text-base font-semibold text-gray-900">
    {{ label }}
  </label>
  <input
    type="range"
    :id="name"
    class="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer"
  />
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply bg-orange-500 appearance-none h-7 w-7 shadow-md rounded-full;
}
</style>
