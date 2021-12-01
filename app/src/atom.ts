import { atom } from '../../lib/src/index';
import { computed, ref } from 'vue';

export const someAtom = atom(ref(0));

export const doubledAtom = atom((get) =>
  computed(() => get(someAtom).value * 2),
);
