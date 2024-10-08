import { b as bootstrapLazy } from './index-d0b376f0.js';
export { s as setNonce } from './index-d0b376f0.js';
import { g as globalScripts } from './app-globals-0f993ce5.js';

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await globalScripts();
  return bootstrapLazy([["my-component",[[1,"my-component",{"chatMessages":[32]}]]]], options);
};

export { defineCustomElements };

//# sourceMappingURL=loader.js.map