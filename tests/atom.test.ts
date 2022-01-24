import { test, expect, describe } from 'vitest';
import { ref, isRef, computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
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

    const w1 = shallowMount(TestComponent, {
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

  test('consume derived readonly atoms', async () => {
    const chisana = createChisana();

    const baseAtom = atom(ref(1));

    const derivedAtom = atom((get) => computed(() => get(baseAtom).value * 2));

    const TestComponent = {
      template: `<div data-test="base">{{ val }}</div> <div data-test="derived">{{ derivedVal }}</div>`,
      setup() {
        const [derivedVal] = useAtom(derivedAtom);
        const [val, setVal] = useAtom(baseAtom);
        return { val, setVal, derivedVal };
      },
    };

    const w1 = shallowMount(TestComponent, {
      global: { plugins: [chisana] },
    });

    const base = w1.find('[data-test="base"]');
    const derived = w1.find('[data-test="derived"]');

    expect(base.text()).toBe('1');
    expect(derived.text()).toBe('2');

    w1.vm.setVal(2);

    await w1.vm.$nextTick();

    expect(base.text()).toBe('2');
    expect(derived.text()).toBe('4');
  });

  test('consume read-write derived atoms', async () => {
    const chisana = createChisana();

    const baseAtom = atom(ref(1));
    const otherAtom = atom(ref(5));

    const derivedAtom = atom(
      (get) => computed(() => get(baseAtom).value * 2),
      (get, set, update) => {
        set(baseAtom, update * 2);
        set(otherAtom, get(otherAtom).value + update);
      },
    );

    const TestComponent = {
      template: `<div data-test="base">{{ val }}</div> <div data-test="derived">{{ derivedVal }}</div>  <div data-test="other">{{ otherVal }}</div>`,
      setup() {
        const [val] = useAtom(baseAtom);
        const [otherVal] = useAtom(otherAtom);
        const [derivedVal, setVal] = useAtom(derivedAtom);
        return { val, setVal, derivedVal, otherVal };
      },
    };

    const w1 = shallowMount(TestComponent, {
      global: { plugins: [chisana] },
    });

    const base = w1.find('[data-test="base"]');
    const derived = w1.find('[data-test="derived"]');
    const other = w1.find('[data-test="other"]');

    expect(base.text()).toBe('1');
    expect(other.text()).toBe('5');
    expect(derived.text()).toBe('2');

    w1.vm.setVal(2);

    await w1.vm.$nextTick();

    expect(base.text()).toBe('4');
    expect(other.text()).toBe('7');
    expect(derived.text()).toBe('8');
  });
});
