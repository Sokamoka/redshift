<template>
  <div class="w-full max-w-xl bg-gray-100 rounded-md p-7">
    <form class="flex flex-col gap-7">
      <div class="flex gap-x-7">
        <div
          class="rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center relative w-44 h-44 overflow-hidden"
        >
          <span class="font-bold text-gray-500">IAU</span>
          <div class="absolute inset-0">
            <img src="https://picsum.photos/800" />
          </div>
        </div>
        <div>
          <h1 class="font-semibold text-3xl leading-10 my-4">Welcome ARe</h1>
          <h2 class="mb-1">An email with the code has been sent to</h2>
          <p class="font-semibold mb-3">areuser@gmail.com</p>
          <a href="#" class="link">Did not get the code?</a>
        </div>
      </div>
      
      <fieldset>
        <FormInput placeholder="Code" />
      </fieldset>

      <FormButton>Submit</FormButton>
    </form>
  </div>
</template>
