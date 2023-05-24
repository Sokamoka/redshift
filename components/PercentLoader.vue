<script setup lang="ts">
const props = defineProps<{
  percent: number;
}>();
const circleRef = ref(null);

const dashOffset = computed(() => {
  // console.dir(unrefElement(circleRef)?.getAttribute("r"));
  const radius = unrefElement(circleRef)?.getAttribute("r");
  const pathLength = Math.PI * 2 * radius;
  const dashoffset = pathLength - pathLength * props.percent;
  return { "stroke-dashoffset": dashoffset };
});
</script>
<template>
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <circle ref="circleRef" id="circle" cx="50" cy="50" r="50" />

      <clipPath id="insideCircleOnly">
        <use xlink:href="#circle" />
      </clipPath>
    </defs>

    <use
      xlink:href="#circle"
      clip-path="url(#insideCircleOnly)"
      stroke-dasharray="314"
      vector-effect="non-scaling-stroke"
      stroke-linecap="butt"
      v-bind="dashOffset"
    />
  </svg>
</template>

<style>
#circle {
  stroke: #9327ff;
  fill: none;
  transition: stroke-dashoffset 0.5s linear;
  stroke-width: 12px;
}
</style>
