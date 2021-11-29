import {
  App,
  computed,
  getCurrentInstance,
  inject,
  reactive,
  Ref,
  ShallowUnwrapRef,
} from 'vue';
import { Atom, Chisana } from './types';

// chisana injection symbol
export const ChisanaSymbol = Symbol();

// active chisana instance so that
// we can register atoms outside of components
export let activeChisana: Chisana | undefined;

// set active chisana instance
export const setActiveChisana = (chisana?: Chisana) => {
  activeChisana = chisana;
};

// get active chisana instance
export const getActiveChisana = () =>
  (getCurrentInstance() && inject<Chisana>(ChisanaSymbol)) || activeChisana;

// create base chisana instance
export function createChisana() {
  const chisana: Chisana = {
    install(app: App) {
      // so that we can register atoms
      setActiveChisana(chisana);
      // provide the chisana instance

      app.provide(ChisanaSymbol, chisana);
    },

    // registry of atoms
    _r: reactive({}),
  };

  return chisana;
}

// to generare unique atom IDs
let atomCount = 0;

// create an atom descriptor
export function atom<T>(value: Ref<T>): Atom<T> {
  const atomKey = `_atom_${atomCount++}`;

  return {
    key: atomKey,
    value,
  };
}

// use an atom
export function useAtom<T>(
  atom: Atom<T>,
): [Ref<T>, (val: T | ((prevVal: T) => T)) => void] {
  const currentInstance = getCurrentInstance();

  // get chisana instance
  const chisana = currentInstance && inject<Chisana>(ChisanaSymbol);

  if (chisana) setActiveChisana(chisana);

  if (!chisana) {
    throw new Error(`
        [chisana] atom was called without using chisana plugin.\n Please register chisana plugin,
        `);
  }

  // if atom is not yet registered do it
  if (!chisana._r[atom.key]) {
    Object.defineProperty(chisana._r, atom.key, {
      value: atom.value,
      writable: true,
    });
  }

  // set value
  function setValue(val: T | ((prevVal: T) => T)) {
    if (!chisana) return;

    (chisana._r as ShallowUnwrapRef<Chisana['_r']>)[atom.key] =
      val instanceof Function
        ? val((chisana._r as ShallowUnwrapRef<Chisana['_r']>)[atom.key] as T)
        : val;
  }

  return [
    computed(
      () => (chisana._r as ShallowUnwrapRef<Chisana['_r']>)[atom.key] as T,
    ),
    setValue,
  ];
}
