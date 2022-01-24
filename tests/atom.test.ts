import { test, expect, describe } from 'vitest';
import { ref, isRef, computed } from 'vue';
import { mount } from '@vue/test-utils';
import { atom, createChisana, useAtom } from '@/atom';

describe('Create atoms', () => {
  test('create primitive atom', () => {
    const someAtom = atom(ref(1));

    expect(someAtom.key).toEqual('_atom_0');
    expect(someAtom.onRegister).toEqual(undefined);

    someAtom.onRegister = (setter) => {
      setter(2);
    };

    expect(typeof someAtom.onRegister === 'function').toBeTruthy();
    expect(isRef(someAtom.read)).toBeTruthy();
  });

  test('create readonly atom', () => {
    const baseAtom = atom(ref(1));

    const derivedDoubledAtom = atom((get) =>
      computed(() => get(baseAtom).value * 2),
    );

    expect(derivedDoubledAtom.read).toBeTruthy();

    expect(typeof derivedDoubledAtom.read === 'function').toBeTruthy();
  });

  test('create read write derived atom', () => {
    const baseAtom = atom(ref(1));

    const derivedAtom = atom(
      (get) => computed(() => get(baseAtom).value * 2),
      (_, set, update) => {
        set(baseAtom, update + 1);
      },
    );

    expect(derivedAtom.read).toBeTruthy();
    expect(derivedAtom.write).toBeTruthy();
    expect(typeof derivedAtom.read === 'function').toBeTruthy();
    expect(typeof derivedAtom.write === 'function').toBeTruthy();
  });
});

describe('consume atoms', () => {
  test('consume primitive atoms', async () => {
    const chisana = createChisana();

    const baseAtom = atom(ref(1));

    const TestComponent = {
      template: `<div>{{ val }}</div>`,
      setup() {
        const [val, setAtom] = useAtom(baseAtom);
        return { val, setAtom };
      },
    };

    const w1 = mount(TestComponent, {
      global: { plugins: [chisana] },
    });

    expect(w1.text()).toBe('1');

    w1.vm.setAtom(2);
    await w1.vm.$nextTick();
    expect(w1.text()).toBe('2');

    w1.vm.setAtom((pVal) => pVal * 2);
    await w1.vm.$nextTick();
    expect(w1.text()).toBe('4');
  });
});
