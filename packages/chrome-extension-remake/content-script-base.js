import { createRemarklet } from './src/remarklet.js';

export function activate() {
    createRemarklet();
}

export function deactivate() {
    console.log('deactivate');
}
