import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    plugins: [
        resolve({module: true}),
        terser({
            ecma: 6,
            compress: {
                drop_console: true,
                ecma: 6,
            }
        })
    ],
    context: 'null',
    moduleContext: 'null',
    output: {
        file: 'dist/index.js',
        format: 'iife',
    }
};
