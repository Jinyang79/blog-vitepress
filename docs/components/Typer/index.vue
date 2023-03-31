<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Typed from 'typed.js';
import { text } from './text';

let typed: Typed;

onMounted(() => {
  typed = new Typed('#text-container', {
    strings: text,
    startDelay: 1000,
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 3500,
    shuffle: true,
    loop: true,
    showCursor: false,
  });
});

onUnmounted(() => {
  typed.destroy();
});
</script>

<template>
  <div>
    <span> 💬 </span>
    <span id="text-container"></span>
  </div>
</template>

<style scoped>
div {
  height: 200px;
}
</style>
