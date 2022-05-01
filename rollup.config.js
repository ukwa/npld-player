import path from 'path';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const outPath = path.resolve(__dirname, 'src/out');

export default {
  input: 'src/app.ts',
  output: [{ dir: outPath, format: 'cjs' }],
  plugins: [
    resolve(),
    typescript({
      compilerOptions: {
        outDir: 'src/out',
        module: 'esnext',
      },
    }),
    // Bundle styles into dist/bundle.css
    css({
      output: 'bundle.css',
    }),
    // Copy Shoelace assets to dist/shoelace
    copy({
      targets: [
        {
          src: path.resolve(
            __dirname,
            'node_modules/@shoelace-style/shoelace/dist/assets'
          ),
          dest: path.resolve(outPath, 'shoelace'),
        },
      ],
    }),
  ],
};
