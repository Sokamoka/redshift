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
      <div class="flex-1 flex items-center justify-end">
        <span class="px-5 text-orange-500 font-bold">areuser</span>
        <div class="bg-orange-500 rounded-full w-10 h-10"></div>
      </div>
    </div>
    <div
      class="grid grid-cols-[40%_1fr] grid-rows-[1fr_64px] gap-7 place-items-stretch w-full bg-gray-100 rounded-md p-8"
    >
      <div class="flex flex-col gap-7">
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
      </div>
      <div>
        <div
          class="flex flex-col items-center justify-center w-full aspect-square bg-white rounded-md relative overflow-hidden"
        >
          <img
            v-if="!isLoading"
            src="~/assets/img/are-logo.svg"
            class="w-12 h-12"
          />
          <div v-if="mainImageSrc" class="absolute inset-0">
            <img :src="mainImageSrc" />
          </div>
          <ClientOnly>
            <div
              v-if="isLoading && progress.progress"
              class="text-2xl font-bold"
            >
              {{ Math.round((progress.progress || 0) * 100) }} %
            </div>
            <img
              v-if="progressImage && isLoading"
              :src="progressImage"
              class="w-20 h-20 opacity-30"
            />
          </ClientOnly>
        </div>
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
      <div>
        <FormButton is-full-width @click="onGenerate"> Generate </FormButton>
      </div>
      <!-- <div>
        <FormButton variant="outlined" is-full-width> Make 3D </FormButton>
      </div> -->
    </div>
  </div>
</template>
