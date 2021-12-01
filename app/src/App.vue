<script setup lang="ts">
// import { ref } from 'vue';
import { useAtom } from '../../lib/src';
import { doubledAtom, someAtom } from './atom';
import HelloWorld from './components/HelloWorld.vue';

const [val, setVal] = useAtom(someAtom);

const [double] = useAtom(doubledAtom);

function setValueFunction(val: number) {
  return val + 1;
}
</script>
<template>
  <div class="main">
    <div>Chisana Play</div>

    <div>Base atom :: {{ val }}</div>

    <div>Derived atom :: {{ double }}</div>

    <button @click="setVal(setValueFunction)">inc</button>

    <h4>From hello world</h4>
    <HelloWorld />
  </div>
</template>
<style>
.main {
  padding: 10px;
}

.main div {
  margin: 10px 0;
}
</style>
