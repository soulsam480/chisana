<script setup lang="ts">
import { useAtom } from 'chisana';
import { baseAtom, doubledAtom, oneAdded, someAtom, tripledAtom } from './atom';
import HelloWorld from './components/HelloWorld.vue';

// primitive
const [val, setVal] = useAtom(someAtom);
// derived
const [double] = useAtom(doubledAtom);
// derived from derived
const [added] = useAtom(oneAdded);

const [baseTripleVal] = useAtom(baseAtom);
// read write derived
const [tripleVal, setTripleVal] = useAtom(tripledAtom);

function setValueFunction(val: number) {
  return val + 1;
}
</script>
<template>
  <div class="main">
    <div>Chisana Play</div>

    <div>Base atom :: {{ val }}</div>

    <div>Derived atom :: {{ double }}</div>

    <div>Plus one :: {{ added }}</div>

    <button @click="setVal(setValueFunction)">inc someAtom</button>

    <h3>Read write derived</h3>
    <div>Base triple val :: {{ baseTripleVal }}</div>
    <div>Tripled derived atom :: {{ tripleVal }}</div>

    <button @click="setTripleVal(setValueFunction)">inc tripledAtom</button>

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
