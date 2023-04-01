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
  <div class="flex">
    <label :for="name" class="flex-1 block text-base text-slate-500">
      {{ label }}
    </label>
    <slot name="value" />
  </div>
  <input
    type="range"
    :id="name"
    :value="modelValue"
    :min="min"
    :max="max"
    class="w-full h-0.5 bg-gradient-to-r from-slate-800 via-slate-400 to-slate-800  rounded-lg appearance-none cursor-pointer"
    @input="onChange"
  />
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply bg-amber-100 appearance-none h-7 w-7 shadow-md rounded-full;
}
</style>
