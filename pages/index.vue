<script lang="ts" setup>
import { CLG_SCALE } from "~~/constants";

definePageMeta({
  middleware: "auth",
});

const mainImageSrc = ref("");

const parameters = reactive({
  steps: 30,
  batch_size: 1,
  cfg_scale: 6,
  prompt:
    "An infinite desert, in the middle of it a large metal wall that goes around in a circle.",
  negative_prompt: "",
  seed: -1,
  save_images: true,
});

const { state, isLoading, execute } = useAsyncState(
  () => $fetch("/api/txt-2-img", { method: "POST", body: parameters }),
  {},
  {
    immediate: false,
    onError: (e) => {
      console.log(e);
      pause();
    },
  }
);

const { state: progress, execute: getProgress } = useAsyncState(
  () => $fetch("/api/progress"),
  {},
  {
    immediate: false,
    resetOnExecute: false,
  }
);

const { pause, resume } = useTimeoutPoll(getProgress, 1000);

const cfgScale = computed({
  get() {
    return CLG_SCALE.get(parameters.cfg_scale).order;
  },
  set(value) {
    const current = Array.from(CLG_SCALE.keys());
    parameters.cfg_scale = current[value];
  },
});

const cfgScaleLabel = computed(() => CLG_SCALE.get(parameters.cfg_scale).name);

const progressImage = computed(() =>
  progress.value?.current_image
    ? `data:image/png;base64,${progress.value?.current_image}`
    : ""
);

watch(state, ({ images }) => {
  if (images) pause();
  mainImageSrc.value = images ? `data:image/png;base64,${images[0]}` : "";
});

const onGenerate = () => {
  execute();
  resume();
};

const onChangeImage = (src: string) => {
  mainImageSrc.value = `data:image/png;base64,${src}`;
};
</script>

<template>
  <div class="w-full max-w-5xl">
    <div class="flex">
      <div class="flex-1 flex items-center">
        <div class="bg-orange-500 rounded-full w-10 h-10"></div>
        <span class="px-5 text-orange-500 font-bold">areuser</span>
      </div>
      <button
        type="button"
        class="px-7 py-5 text-base text-gray-900 font-semibold rounded-t-md"
      >
        Image to Image
      </button>
      <button
        type="button"
        class="px-7 py-5 text-base text-amber-100 font-medium bg-slate-900 rounded-t-md"
      >
        Text to Image
      </button>
    </div>
    <div
      class="grid grid-cols-[1fr_40%] place-items-stretch w-full bg-amber-100 rounded-md overflow-hidden rounded-tr-none"
    >
      <div
        class="flex flex-col items-center justify-center w-full relative overflow-hidden"
      >
        <img
          v-if="!isLoading && !mainImageSrc"
          src="~/assets/img/are-logo.svg"
          class="w-12 h-12"
        />
        <img
          v-if="mainImageSrc"
          :src="mainImageSrc"
          class="object-contain w-full h-full"
        />
        <ClientOnly>
          <div v-if="isLoading && progress.progress" class="text-2xl font-bold">
            {{ Math.round((progress.progress || 0) * 100) }} %
          </div>
          <img
            v-if="progressImage && isLoading"
            :src="progressImage"
            class="w-20 h-20 opacity-30"
          />
        </ClientOnly>
      </div>
      <div class="flex flex-col gap-6 p-6 bg-slate-900">
        <fieldset>
          <FormTextarea
            v-model="parameters.prompt"
            rows="3"
            placeholder="Type promt..."
          ></FormTextarea>
        </fieldset>
        <fieldset>
          <FormTextarea
            v-model="parameters.negative_prompt"
            rows="1"
            placeholder="Type negative promt..."
          />
        </fieldset>
        <fieldset>
          <FormInput placeholder="Seed">
            <template v-slot:append>
              <a href="#" class="is-link px-3">Randomize</a>
            </template>
          </FormInput>
        </fieldset>
        <fieldset>
          <FormRange
            v-model="cfgScale"
            name="clg-scale"
            :label="`CLG Scale (${cfgScaleLabel})`"
            :min="0"
            :max="4"
          ></FormRange>
        </fieldset>
        <fieldset>
          <FormRange
            v-model="parameters.steps"
            name="detail"
            :label="`Detail (${parameters.steps})`"
            :min="20"
            :max="100"
          ></FormRange>
        </fieldset>
        <fieldset>
          <FormRange
            v-model="parameters.batch_size"
            name="picture-number"
            :label="`Number of pictures (${parameters.batch_size})`"
            :min="1"
            :max="10"
          />
        </fieldset>
        <FormButton is-full-width @click="onGenerate"> Generate </FormButton>

        <div class="flex flex-wrap gap-3 mt-3">
          <template v-for="image in state.images">
            <img
              :src="`data:image/png;base64,${image}`"
              class="w-24 h-24 cursor-pointer"
              @click="onChangeImage(image)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
