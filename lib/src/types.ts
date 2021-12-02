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
export type Setter = {
  <T>(atom: Primitive<T>, value: T): void;
};

export type SetValue<T> = (val: T | ((prevVal: T) => T)) => void;

export type Reader<T> = (getter: Getter) => Ref<T>;
export type Writer<T> = (getter: Getter, setter: Setter, update: T) => void;

export type AtomValue<T> = Ref<T> | Reader<T>;

export type Atom = {
  key: string;
};

export type Primitive<T> = Atom & { read: Ref<T> }; // primitive
export type ReadableAtom<T> = Atom & { read: Reader<T> }; // readonly derived
export type WritableAtom<T> = ReadableAtom<T> & { write: Writer<T> }; // read-write derived

export type GenericAtom<T> = Primitive<T> | ReadableAtom<T> | WritableAtom<T>;
