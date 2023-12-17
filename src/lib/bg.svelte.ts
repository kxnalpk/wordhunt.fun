// bg.svelte.ts
import type { Tweened } from 'svelte/motion';

export interface BgAnimation {
  transform: Tweened<string>;
}
