import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://statuesque-marshmallow-26e5bb.netlify.app/',
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});