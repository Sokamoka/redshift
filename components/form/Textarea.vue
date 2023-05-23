<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const { modelValue } = useVModels(props, emit)
</script>
<template>
  <textarea
    v-model="modelValue"
    class="w-full border-2 border-slate-800 p-4 bg-slate-800 text-slate-300 outline-none rounded-md focus-within:border-amber-100 resize-none"
  ></textarea>
</template>
