<script lang="ts">
export default {
  name: "FormInput",

  inheritAttrs: false,

  props: {
    modelValue: {
      type: [Number, String],
      default: "",
    },
  },

  setup(props, { emit }) {
    const { modelValue } = useVModels(props, emit);

    return {
      modelValue,
    };
  },
};
</script>

<template>
  <div
    class="flex items-center bg-slate-800 border-2 border-slate-800 text-slate-300 focus-within:border-amber-100 rounded-md w-full"
  >
    <slot name="prepend" />
    <input
      v-model="modelValue"
      class="p-3 outline-none flex-1 w-full bg-transparent"
      v-bind="$attrs"
    />
    <slot name="append" />
  </div>
</template>
