<!--
  The ELPI wordmark (public/elpi-icon2-black.png) inline in the text, in the
  color of the text (it is a mask filled with currentColor) and as tall as
  its capital letters. vite.config.ts puts it in place of the word "Elpi" in
  the text of the slides; it can also be used directly: <ElpiLogo />
-->

<script setup lang="ts">
const mask = `url(${import.meta.env.BASE_URL}elpi-icon2-black.png)`
</script>

<template>
  <span class="elpi-logo" role="img" aria-label="Elpi" :style="{ maskImage: mask, WebkitMaskImage: mask }" />
</template>

<style scoped>
.elpi-logo {
  display: inline-block;
  height: .72em;
  width: calc(.72em * 270 / 96); /* the aspect ratio of the picture */
  vertical-align: 0;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: left center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: left center;
}
</style>
