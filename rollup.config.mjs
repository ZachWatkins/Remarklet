import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json" with { type: "json" };

export default {
    input: pkg.main,
    output: [
        {
            file: pkg.module,
            format: "iife",
            name: "remarklet",
            plugins: [terser()],
        },
        {
            file: pkg.main,
            format: "es",
            sourcemap: true,
        },
    ],
    plugins: [
        resolve({
            moduleDirectories: ["node_modules"],
        }),
        commonjs(),
        json(),
    ],
};
