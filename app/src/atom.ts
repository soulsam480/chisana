import { atom } from '../../lib/src/index';
import { computed, ref } from 'vue';

// primitive
export const someAtom = atom(ref(0));

// derived
export const doubledAtom = atom((get) =>
  computed(() => get(someAtom).value * 2),
);

// derived from derived
export const oneAdded = atom((get) =>
  computed(() => get(doubledAtom).value + 1),
);
