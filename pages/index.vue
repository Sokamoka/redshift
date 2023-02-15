<template>
  <div class="w-full max-w-5xl">
    <button
      type="button"
      class="px-7 py-5 text-base text-gray-900 font-semibold bg-gray-100 rounded-t-md"
    >
      Text to Image
    </button>
    <button
      type="button"
      class="px-7 py-5 text-base text-orange-500 font-semibold bg-white rounded-t-md"
    >
      Image to image
    </button>
    <div
      class="grid grid-cols-[40%_1fr] grid-rows-[1fr_64px] gap-7 place-items-stretch w-full bg-gray-100 rounded-md p-8"
    >
      <div class="flex flex-col gap-7">
        <fieldset>
          <FormTextarea rows="3" placeholder="Type promt..."></FormTextarea>
        </fieldset>
        <fieldset>
          <FormTextarea
            rows="1"
            placeholder="Type negative promt..."
          />
        </fieldset>
        <fieldset>
          <FormInput placeholder="Seed"></FormInput>
        </fieldset>
        <fieldset>
          <FormRange name="clg-scale" label="CLG Scale"></FormRange>
        </fieldset>
        <fieldset>
          <FormRange name="detail" label="Detail"></FormRange>
        </fieldset>
        <fieldset>
          <FormRange
            name="picture-number"
            label="Number of pictures"
          />
        </fieldset>
      </div>
      <div>
        <div
          class="flex items-center justify-center w-full aspect-square bg-white rounded-md relative overflow-hidden"
        >
          <img src="~/assets/img/are-logo.svg" class="w-12 h-12" />
          <div class="absolute inset-0">
            <img src="https://picsum.photos/800" />
          </div>
        </div>
      </div>
      <div>
        <FormButton class="w-full bg-orange-500 text-white font-bold text-xl">
          Generate
        </FormButton>
      </div>
      <div>
        <FormButton class="w-full text-orange-500 font-bold text-xl">
          Make 3D
        </FormButton>
      </div>
    </div>
  </div>
</template>
