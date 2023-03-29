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
    class="w-full p-4 border-4 border-gray-900 outline-none rounded-md focus-within:border-orange-500"
  ></textarea>
</template>
