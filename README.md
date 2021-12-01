## Chisana
> an attempt to create a jotai like thing for vue 3

### status
- pre alpha
- atoms
  - writable
  - derived readonly

### based on the amazing work of
- Jotai -> https://github.com/pmndrs/jotai
- Pinia -> https://github.com/posva/pinia

### goals
- [ ] keep API similar
- [ ] Don't complicate core
- [ ] small bundle size
- [ ] code splitting
- [ ] ...

### docs
### first create a primitive atom

An atom represents a piece of state. All you need is to specify an initial
value, which can be primitive values like strings and numbers, objects and
arrays. You can create as many primitive atoms as you want.

```ts
import { atom } from '../../lib/src/index';
import { computed, ref } from 'vue';

// pass a ref as state, it should be a ref as a atom can only be a primitive 
// i.e. string, number, array, object
export const counterAtom = atom(ref(0));
```

### use the atom in your components

```vue
<script setup lang="ts">
import { useAtom } from '../../lib/src';
import { counterAtom } from './atom';

// setValue accepts both value and a callback function returning a value
// the previous value of the atom will be the argument of the callback function
const [val, setVal] = useAtom(counterAtom);

function setValueFunction(val: number) {
  return val + 1;
}
</script>
<template>
  <div>
    <div>Base atom :: {{ val }}</div>

    <button @click="setVal(setValueFunction)">inc</button>
  </div>
</template>
```

### create derived atoms with computed values

A new read-only atom can be created from existing atoms by passing a read
function as the first argument. `get` allows you to fetch the contextual value
of any atom. For now we need to wrap the return value inside computed to retain reactivity. This can be improved

```ts
export const doubledAtom = atom((get) =>
  // need to wrap the return value inside computed to retain reactivity
  computed(() => get(counterAtom).value * 2),
);
```

```vue
<script setup lang="ts">
import { useAtom } from '../../lib/src';
import { doubledAtom } from './atom';

const [double] = useAtom(doubledAtom);

</script>
<template>
  <div>
    <div>Derived atom :: {{ double }}</div>
  </div>
</template>
```
### approach
- atoms -> ref
- createAtom -> create atom, register it, returns a unique key to retrive atom
- useAtom -> pick atom from injected global atoms registry
- only [get, set]
  - get -> inject -> pick -> maintain reactive connection
  - set -> pick -> update
- only valid inside components
- createRoot -> create registry and inject
- chisana._r -> global atoms registry -> reactive<{[key: string]: S}>()


### issues
- there is a memory leak issue i think

### need help
I don't have a deep knowledge on the vue reactivity internals and I feel this lib can be improved a lot. Please help me with your knowledge, Thanks