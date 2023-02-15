<script lang="ts" setup>
const onSubmit = () => navigateTo("code");
</script>

<template>
  <div class="w-full max-w-xl bg-gray-100 rounded-md p-7">
    <form class="flex flex-col gap-7" @submit.prevent="onSubmit">
      <div class="px-4 py-6">
        <img src="~/assets/img/are-logo.svg" class="w-12 h-12 mx-auto" />
      </div>

      <fieldset>
        <FormInput placeholder="E-mail" />
      </fieldset>

      <FormButton type="submit">Login</FormButton>
    </form>
  </div>
</template>
