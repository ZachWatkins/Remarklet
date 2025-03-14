import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/main.js',
    output: [
        {
            file: 'remarklet.js',
            format: 'cjs'
        },
        {
            file: 'remarklet.min.js',
            format: 'iife',
            name: 'version',
            plugins: [terser()]
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
