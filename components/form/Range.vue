<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Number,
    deafult: 0,
  },

  name: {
    type: String,
    required: true,
  },

  label: {
    type: String,
    default: "",
  },

  min: {
    type: Number,
    deafult: 0,
  },

  max: {
    type: Number,
    deafult: 100,
  },
});

const emit = defineEmits([
  'update:modelValue'
])

const onChange = (event: Event) => {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
};
</script>

<template>
  <label :for="name" class="block text-base font-semibold text-gray-900">
    {{ label }}
  </label>
  <input
    type="range"
    :id="name"
    :value="modelValue"
    :min="min"
    :max="max"
    class="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer"
    @input="onChange"
  />
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply bg-orange-500 appearance-none h-7 w-7 shadow-md rounded-full;
}
</style>
