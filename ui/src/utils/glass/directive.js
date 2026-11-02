import { createAuroraGlassSurface } from './surface.js';

const surfaces = new WeakMap();

export const vGlass = {
  mounted(element, binding) { surfaces.set(element, createAuroraGlassSurface(element, binding.value)); },
  updated(element, binding) { surfaces.get(element).update(binding.value); },
  beforeUnmount(element) { surfaces.get(element).destroy(); surfaces.delete(element); },
};
