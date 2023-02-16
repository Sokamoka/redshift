<script lang="ts">
export default {
  name: 'FormInput',

  inheritAttrs: false,
}
</script>

<template>
  <div
    class="flex items-center bg-white border-4 border-gray-900 focus-within:border-orange-500 rounded-md w-full"
  >
    <slot name="prepend" />
    <input type="text" class="p-3 outline-none flex-1 w-full" v-bind="$attrs" />
    <slot name="append" />
  </div>
</template>
