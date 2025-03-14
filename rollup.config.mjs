import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' with { type: 'json' };

export default {
    input: pkg.main,
    output: [
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
