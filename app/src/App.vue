<script setup lang="ts">
// import { ref } from 'vue';
import { useAtom } from '../../lib/src';
import { someAtom } from './atom';
import HelloWorld from './components/HelloWorld.vue';

const [val, setVal] = useAtom(someAtom);

function setValueFunction(val: number) {
  return val + 1;
}
</script>
<template>
  <div>Chisana test</div>

  <div>Value :: {{ val }}</div>

  <button @click="setVal(setValueFunction)">inc</button>

  <h1>From hello world</h1>

  <HelloWorld />
</template>
<style lang="scss" scoped></style>
