<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  label: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const { modelValue } = useVModels(props, emit);
</script>

<template>
  <label class="flex w-full justify-between">
    <slot name="label">
      <span class="text-base text-slate-500">{{ label }}</span>
    </slot>
    <input
      v-model="modelValue"
      type="checkbox"
      class="appearance-none w-10 focus:outline-none checked:bg-amber-100 h-6 bg-slate-500 rounded-full before:inline-block before:rounded-full before:bg-slate-900 before:h-4 before:w-4 checked:before:translate-x-full shadow-inner transition-all duration-300 before:ml-1 before:mt-1"
    />
  </label>
</template>
