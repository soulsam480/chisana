import { Ref } from 'vue';
import { atom } from '../atom';

export type Storage<Value> = {
  getItem: (key: string) => Value | Promise<Value>;
  setItem: (key: string, newValue: Value) => void | Promise<void>;
};

const defaultStorage: Storage<unknown> = {
  getItem: (key) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      throw new Error('no value stored');
    }
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
};

export function atomWithStorage<T>(
  key: string,
  initialValue: Ref<T>,
  storage: Storage<T> = defaultStorage as Storage<T>,
) {
  const getInitialValue = () => {
    try {
      return storage.getItem(key);
    } catch {
      return initialValue.value;
    }
  };

  const baseAtom = atom(initialValue);

  baseAtom.onRegister = (setVal) => {
    Promise.resolve(getInitialValue()).then(setVal);
  };

  const anAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const newValue =
        typeof update === 'function'
          ? (update as Function)(get(baseAtom).value)
          : update;

      set(baseAtom, newValue);
      storage.setItem(key, newValue);
    },
  );

  return anAtom;
}
