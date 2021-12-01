import { Ref, App, ShallowUnwrapRef } from 'vue';

export type MaybeRef<T> = T | Ref<T>;

export type Chisana = {
  install: (app: App) => void;
  _r: Record<string, Ref<unknown>>;
};

export type ChisanaWithShallowState<T extends Chisana> = {
  _r: ShallowUnwrapRef<Chisana['_r']>;
} & Omit<T, '_r'>;

export type Getter = { <T>(atom: GenericAtom<T>): Ref<T> };

export type Reader<T> = (getter: Getter) => Ref<T>;

export type AtomValue<T> = Ref<T> | Reader<T>;

export type Atom = {
  key: string;
};

export type WritableAtom<T> = Atom & { value: Ref<T> };
export type ReadableAtom<T> = Atom & { value: Reader<T> };

export type GenericAtom<T> = WritableAtom<T> | ReadableAtom<T>;
