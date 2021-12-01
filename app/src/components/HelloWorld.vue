<script setup lang="ts">
import { useAtom } from '../../../lib/src';
import { someAtom } from '../atom';

const [val] = useAtom(someAtom);
</script>
<template>
  <div>Base atom :: {{ val }}</div>
</template>
<style lang="scss" scoped></style>
