import { atom } from '../../lib/src/index';
import { ref } from 'vue';

export const someAtom = atom(ref(0));
