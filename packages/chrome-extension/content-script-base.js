import { createRemarklet } from './src/remarklet.js';

export function activate() {
    const remarklet = createRemarklet();
}

export function deactivate() {
    console.log('deactivate');
}
