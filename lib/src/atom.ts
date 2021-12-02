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
  SetValue,
  Primitive,
  Writer,
  WritableAtom,
  Setter,
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
export function atom<T>(value: Ref<T>): Primitive<T>; // primitive
export function atom<T>(read: Reader<T>): ReadableAtom<T>; // readonly derived
export function atom<T>(read: Reader<T>, write: Writer<T>): WritableAtom<T>; // read write derived
export function atom<T>(read: AtomValue<T>, write?: Writer<T>) {
  const key = `_atom_${atomCount++}`;

  const config = {
    key,
    read,
  };

  // primitive / readonly derived
  if (!write) return config;

  (config as WritableAtom<T>).write = write;

  return config;
}

function createGetAtom<T>(
  atom: GenericAtom<T>,
  chisana: ChisanaWithShallowState<Chisana>,
) {
  const getAtomVal: Getter = <T>(atom: GenericAtom<T>) => {
    createGetAtom(atom, chisana);
    // to cerate effect and retain reactivity
    return computed(() => chisana._r[atom.key] as T);
  };

  // if atom is not yet registered do it
  if (!chisana._r[atom.key]) {
    Object.defineProperty(chisana._r, atom.key, {
      writable: true,
      // TODO: this can be improved when a derived atom is used
      value: isRef<T>(atom.read) ? atom.read : atom.read(getAtomVal),
    });
  }
}

// use an atom
export function useAtom<T>(atom: Primitive<T>): [ComputedRef<T>, SetValue<T>]; // primitive
export function useAtom<T>(
  atom: WritableAtom<T>,
): [ComputedRef<T>, SetValue<T>]; // read write derived
export function useAtom<T>(atom: ReadableAtom<T>): [ComputedRef<T>]; // readonly derived
export function useAtom<T>(atom: any) {
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

  // if a derived atom only return getter
  if (!atom.write && typeof atom.read === 'function')
    return [computed(() => chisana._r[atom.key])];

  // if derived read-write atom
  if (atom.write) {
    if (typeof (atom as WritableAtom<T>).write !== 'function')
      throw new TypeError('[chisana] Atom write argument should be a function');

    // set value
    // val -> coming from setVal
    // apply writer to setVal
    const writableSetVal: SetValue<T> = (val) => {
      // get atom val in setter
      const getter: Getter = <T>(atomToGet: GenericAtom<T>) =>
        computed(() => chisana._r[atomToGet.key] as T);

      // setter
      const setter: Setter = <T>(atomToSet: GenericAtom<T>, value: T) => {
        chisana._r[atomToSet.key] = value;
      };

      // call writer with getter, setter and argument
      atom.write(
        getter,
        setter,
        typeof val === 'function'
          ? (val as Function)(chisana._r[atom.key])
          : val,
      );
    };

    // return getVal and setVal
    return [computed(() => chisana._r[atom.key]), writableSetVal];
  }

  // set value function
  const setValue: SetValue<T> = (val) => {
    chisana._r[atom.key] =
      typeof val === 'function'
        ? (val as Function)(chisana._r[atom.key] as T)
        : val;
  };

  // return getter and setter
  return [computed(() => chisana._r[atom.key]), setValue];
}
