import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const PRODUCTION = process.env.NODE_ENV === 'production';

export default {
    input: 'src/index.js',
    plugins: [
        resolve({module: true}),
        babel({
            babelrc: false,
            presets: [['env', { modules: false }]],
        }),
        PRODUCTION ? uglify({
            toplevel: true,
            compress: {
                drop_console: false,
                drop_debugger: false,
                passes: 2,
            },
            mangle: {
                toplevel: true,
            },
            sourcemap: false,
        }) : {},
    ],
    context: 'null',
    moduleContext: 'null',
    output: {
        file: 'dist/index.js',
        format: 'iife',
    }
};
