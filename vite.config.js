import path from 'path';

export default {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'Remarklet',
      formats: ['iife'],
    },
  },
};
