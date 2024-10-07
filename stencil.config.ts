import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'botty',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://timmy-io.vercel.app/'// disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
