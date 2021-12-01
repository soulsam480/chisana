import {
  App,
  computed,
  getCurrentInstance,
  inject,
  InjectionKey,
  reactive,
  Ref,
  isRef,
  ComputedRef,
} from 'vue';
import {
  AtomValue,
  Chisana,
  ChisanaWithShallowState,
  GenericAtom,
  Getter,
  ReadableAtom,
  Reader,
  WritableAtom,
} from './types';

// chisana injection symbol
export const ChisanaSymbol = (
  __DEV__ ? Symbol('chisana') : Symbol()
) as InjectionKey<ChisanaWithShallowState<Chisana>>;

//TODO: can be improved to consume state outside of components
// current plan is to only allow consumption inside components

// active chisana instance
// export let activeChisana: Chisana | undefined;

// set active chisana instance
// export const setActiveChisana = (chisana?: Chisana) => {
//   activeChisana = chisana;
// };

// get active chisana instance
// export const getActiveChisana = () =>
//   (getCurrentInstance() && inject(ChisanaSymbol)) || activeChisana;

//----------------------

// create base chisana instance
export function createChisana() {
  const chisana: Chisana = {
    install(app: App) {
      // so that we can register atoms
      // setActiveChisana(chisana);

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
export function atom<T>(value: Ref<T>): WritableAtom<T>;
export function atom<T>(read: Reader<T>): ReadableAtom<T>;
export function atom<T>(value: AtomValue<T>) {
  const atomKey = `_atom_${atomCount++}`;

  return {
    key: atomKey,
    value,
  };
}

function createGetAtom<T>(
  atom: GenericAtom<T>,
  chisana: ChisanaWithShallowState<Chisana>,
) {
  const getAtomVal: Getter = <T>(atom: GenericAtom<T>) => {
    createGetAtom(atom, chisana);

    return computed(() => chisana._r[atom.key] as T);
  };

  // if atom is not yet registered do it
  if (!chisana._r[atom.key]) {
    Object.defineProperty(chisana._r, atom.key, {
      writable: true,
      // TODO: this can be improved when a derived atom is used
      value: isRef<T>(atom.value) ? atom.value : atom.value(getAtomVal),
    });
  }
}

// use an atom
export function useAtom<T>(atom: ReadableAtom<T>): [ComputedRef<T>];
export function useAtom<T>(
  atom: WritableAtom<T>,
): [ComputedRef<T>, (val: T | ((prevVal: T) => T)) => void];
export function useAtom<T>(atom: GenericAtom<T>) {
  const currentInstance = getCurrentInstance();

  // get chisana instance
  const chisana = currentInstance && inject(ChisanaSymbol);

  if (!chisana) {
    throw new Error(`
        [chisana] useAtom was called on an atom without using the chisana plugin.\n Please register and use the chisana plugin,
        `);
  }

  // if atom is not yet registered do it
  createGetAtom(atom, chisana);

  // set value
  function setValue(val: T | ((prevVal: T) => T)) {
    if (!chisana) return;

    chisana._r[atom.key] =
      val instanceof Function ? val(chisana._r[atom.key] as T) : val;
  }

  // is a derived atom only return getter
  if (typeof atom.value === 'function')
    return [computed(() => chisana._r[atom.key] as T)];

  // return getter and setter
  return [computed(() => chisana._r[atom.key] as T), setValue];
}
