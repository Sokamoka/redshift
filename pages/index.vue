<script lang="ts" setup>
import {
  CLG_SCALE,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_IMAGE_HEIGHT,
} from "~~/constants";
import { generateRandomInt } from "~/utils/generate-random-int";

enum PanelState {
  Form,
  Result,
  Minimal,
}

// definePageMeta({
//   middleware: "auth",
// });

const mainImageSrc = ref("");
const panelState = ref<PanelState>(PanelState.Form);

const storedSettings = useSessionStorage(
  "redshift",
  { seed: generateRandomInt(), fixedStyle: false },
  { mergeDefaults: true }
);

const parameters = reactive({
  steps: 30,
  batch_size: 1,
  cfg_scale: 6,
  prompt: "",
  negative_prompt: "",
  seed: -1,
  save_images: true,
  width: DEFAULT_IMAGE_WIDTH,
  height: DEFAULT_IMAGE_HEIGHT,
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

const fixedStyle = computed<boolean>({
  get() {
    return storedSettings.value.fixedStyle;
  },
  set(value: boolean) {
    storedSettings.value.fixedStyle = value;
  },
});

const aspectRatio = computed<string>({
  get() {
    return getAspectRatio(parameters.width, parameters.height);
  },
  set(value) {
    const { width, height } = setImageDimensions(value);
    parameters.width = width;
    parameters.height = height;
  },
});

const progressImage = computed(() =>
  progress.value?.current_image
    ? `data:image/png;base64,${progress.value?.current_image}`
    : ""
);

watch(state, ({ images }) => {
  if (images) {
    pause();
    panelState.value = PanelState.Result;
  }
  mainImageSrc.value = images ? `data:image/png;base64,${images[0]}` : "";
});

const onGenerate = () => {
  if (fixedStyle.value) {
    parameters.seed = storedSettings.value.seed;
  } else {
    const newSeed = generateRandomInt();
    parameters.seed = newSeed;
    storedSettings.value.seed = newSeed;
  }
  execute();
  resume();
  panelState.value = PanelState.Form;
};

const onChangeImage = (src: string) => {
  mainImageSrc.value = `data:image/png;base64,${src}`;
};

const onEditProperties = () => {
  panelState.value = PanelState.Form;
};
const onResetEditProperties = () => {
  panelState.value = PanelState.Result;
};
const onCancel = () => {
  panelState.value = PanelState.Form;
};
</script>

<template>
  <div class="w-full max-w-5xl">
    <!-- <div class="flex">
      <div class="flex-1 flex items-center">
        <div class="bg-orange-500 rounded-full w-10 h-10"></div>
        <span class="px-5 text-orange-500 font-bold">areuser</span>
      </div>
      <button
        type="button"
        class="px-7 py-5 text-base text-gray-900 font-semibold rounded-t-md"
        @click="onResetEditProperties"
      >
        Image to Image
      </button>
      <button
        type="button"
        class="px-7 py-5 text-base text-amber-100 font-medium bg-slate-900 rounded-t-md"
      >
        Text to Image
      </button>
    </div> -->
    <div
      class="grid grid-cols-[1fr_40%] place-items-stretch w-full h-[700px] bg-amber-100 rounded-md overflow-hidden rounded-tr-none"
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
      <div class="flex flex-col bg-slate-900 overflow-hidden">
        <EditProperties
          v-if="panelState === PanelState.Result"
          class="p-6 transition-all duration-300"
          @edit="onEditProperties"
        />

        <div
          v-else
          class="flex-1 flex flex-col gap-6 p-6 overflow-hidden transition-all duration-300"
        >
          <fieldset class="flex-1">
            <FormTextarea
              v-model="parameters.prompt"
              rows="3"
              placeholder="Type promt..."
              class="h-full"
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
            <FormToggle v-model="fixedStyle" label="Generate similar" />
          </fieldset>
          <fieldset>
            <FormRange
              v-model="cfgScale"
              name="clg-scale"
              label="Conformity"
              :min="0"
              :max="4"
            >
              <template v-slot:value>
                <span class="text-amber-100 font-bold">
                  {{ cfgScaleLabel }}
                </span>
              </template>
            </FormRange>
          </fieldset>
          <fieldset>
            <FormRange
              v-model="parameters.steps"
              name="detail"
              label="Detail"
              :min="20"
              :max="150"
            >
              <template v-slot:value>
                <span class="text-amber-100 font-bold">{{
                  parameters.steps
                }}</span>
              </template>
            </FormRange>
          </fieldset>
          <fieldset>
            <FormRange
              v-model="parameters.batch_size"
              name="picture-number"
              label="Output"
              :min="1"
              :max="10"
            >
              <template v-slot:value>
                <span class="text-amber-100 font-bold">{{
                  parameters.batch_size
                }}</span>
              </template>
            </FormRange>
          </fieldset>

          <fieldset>
            <div class="grid grid-cols-3 gap-4">
              <label
                :class="[
                  'flex items-center justify-center p-2 rounded-md',
                  aspectRatio === ASPECT_RATIO_PORTRAIT
                    ? 'bg-amber-100'
                    : 'bg-slate-800',
                ]"
              >
                <input
                  type="radio"
                  v-model="aspectRatio"
                  name="aspect-ratio"
                  :value="ASPECT_RATIO_PORTRAIT"
                  class="hidden"
                />
                <div
                  :class="[
                    'w-3 h-5 border-2 rounded-sm',
                    aspectRatio === ASPECT_RATIO_PORTRAIT
                      ? 'border-slate-900'
                      : 'border-slate-400',
                  ]"
                />
              </label>
              <label
                :class="[
                  'flex items-center justify-center p-2 rounded-md',
                  aspectRatio === ASPECT_RATIO_LANDSCAPE
                    ? 'bg-amber-100'
                    : 'bg-slate-800',
                ]"
              >
                <input
                  type="radio"
                  v-model="aspectRatio"
                  name="aspect-ratio"
                  :value="ASPECT_RATIO_LANDSCAPE"
                  class="hidden"
                />
                <div
                  :class="[
                    'w-5 h-3 border-2 rounded-sm',
                    aspectRatio === ASPECT_RATIO_LANDSCAPE
                      ? 'border-slate-900'
                      : 'border-slate-400',
                  ]"
                />
              </label>
              <label
                :class="[
                  'flex items-center justify-center p-2 rounded-md',
                  aspectRatio === ASPECT_RATIO_SQUARE
                    ? 'bg-amber-100'
                    : 'bg-slate-800',
                ]"
              >
                <input
                  type="radio"
                  v-model="aspectRatio"
                  name="aspect-ratio"
                  :value="ASPECT_RATIO_SQUARE"
                  class="hidden"
                />
                <div
                  :class="[
                    'w-5 h-5 border-2 rounded-sm',
                    aspectRatio === ASPECT_RATIO_SQUARE
                      ? 'border-slate-900'
                      : 'border-slate-400',
                  ]"
                />
              </label>
            </div>
          </fieldset>
          <FormButton v-if="isLoading" variant="secondary" is-full-width @click="onCancel"> Cancel </FormButton>
          <FormButton v-else is-full-width @click="onGenerate"> Generate </FormButton>
        </div>

        <div
          v-if="panelState !== PanelState.Form"
          :class="[
            'p-6 bg-slate-800 overflow-hidden',
            { 'flex-grow': panelState === PanelState.Result },
          ]"
        >
          <span
            v-if="panelState === PanelState.Result"
            class="block w-full text-center font-medium text-slate-300"
          >
            Variations
          </span>
          <div
            :class="[
              'gap-3 overflow-scroll h-full',
              panelState === PanelState.Minimal
                ? 'flex'
                : 'grid grid-cols-2 grid-rows-mincontent py-5',
            ]"
          >
            <template v-for="image in state.images">
              <img
                :src="`data:image/png;base64,${image}`"
                :class="[
                  'cursor-pointer h-auto transition ease-in-out rounded',
                  {
                    'w-12': panelState === PanelState.Minimal,
                  },
                ]"
                @click="onChangeImage(image)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
