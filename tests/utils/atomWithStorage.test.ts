import { describe, expect, test } from 'vitest';
import { ref } from 'vue';

import { atomWithStorage } from '@/utils';
import { createChisana, useAtom } from '@/atom';
import { shallowMount } from '@vue/test-utils';

describe('atom with storage tests', () => {
  const storageData: Record<string, number> = {
    count: 10,
  };

  const dummyStorage = {
    getItem: (key: string) => {
      if (!(key in storageData)) {
        throw new Error('no value stored');
      }

      return storageData[key] as number;
    },
    setItem: (key: string, newValue: number) => {
      storageData[key] = newValue;
    },
    removeItem: (key: string) => {
      delete storageData[key];
    },
  };

  test('simple count with previous value', async () => {
    const countAtom = atomWithStorage('count', ref(1), dummyStorage);

    const chisana = createChisana();

    const TestComponent = {
      template: `<div>{{ val }}</div>`,
      setup() {
        const [val, setAtom] = useAtom(countAtom);
        return { val, setAtom };
      },
    };

    const w1 = shallowMount(TestComponent, {
      global: { plugins: [chisana] },
    });

    await w1.vm.$nextTick();

    expect(w1.text()).toBe('10');

    w1.vm.setAtom(2);

    await w1.vm.$nextTick();

    expect(storageData.count).toBe(2);
    expect(w1.text()).toBe('2');
  });

  test('simple count without previous value', async () => {
    storageData.count && delete storageData.count;

    const countAtom = atomWithStorage('count', ref(1), dummyStorage);

    const chisana = createChisana();

    const TestComponent = {
      template: `<div>{{ val }}</div>`,
      setup() {
        const [val, setAtom] = useAtom(countAtom);
        return { val, setAtom };
      },
    };

    const w1 = shallowMount(TestComponent, {
      global: { plugins: [chisana] },
    });

    await w1.vm.$nextTick();

    expect(w1.text()).toBe('1');
  });
});
