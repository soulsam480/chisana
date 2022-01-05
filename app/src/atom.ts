import { atom } from 'chisana';
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

// read write derived

export const baseAtom = atom(ref(1));

export const tripledAtom = atom(
  (get) => computed(() => get(baseAtom).value * 3),
  (get, set, update) => {
    set(someAtom, get(someAtom).value + 1);
    set(baseAtom, update + 2);
  },
);

// export const persistedAtom = atomWithStorage;
