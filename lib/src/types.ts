import { Ref, App } from 'vue';

export type MaybeRef<T> = T | Ref<T>;

export type Chisana = {
  install: (app: App) => void;
  _r: Record<string, Ref<unknown>>;
};

export type Atom<T> = {
  key: string;
  value: MaybeRef<T>;
};
