import { test, expect } from 'vitest';
import { ref, isRef } from 'vue';

import { atom } from '../lib/src';

test('create atoms', () => {
  const someAtom = atom(ref(1));

  expect(someAtom.key).toEqual('_atom_0');
  expect(someAtom.onRegister).toEqual(undefined);
  expect(isRef(someAtom.read)).toBeTruthy();
});
