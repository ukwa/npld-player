import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';
import resolve from '@rollup/plugin-node-resolve';

const outPath = path.resolve(__dirname, 'src/dist');

export default {
  input: 'src/app.ts',
  output: [{ dir: outPath, format: 'es' }],
  plugins: [
    resolve(),
    commonjs(),
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
