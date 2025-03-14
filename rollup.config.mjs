import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/main.js',
    output: [
        {
            file: 'dist/remarklet.cjs',
            format: 'cjs',
            external: [
                'interactjs',
            ]
        },
        {
            file: 'dst/remarklet.mjs',
            format: 'es',
            external: [
                'interactjs',
            ]
        },
        {
            file: 'dist/remarklet.min.js',
            format: 'iife',
            name: 'remarklet',
            plugins: [
                terser()
            ]
        }
    ],
    plugins: [
        resolve({
            moduleDirectories: ['node_modules']
        }),
        commonjs(),
        json()
    ]
};
