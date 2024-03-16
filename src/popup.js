import { getState, setState } from './popup/store';

window['on-button'].addEventListener('click', function () {
    if (!getState('ON')) {
        window['on-button'].classList.remove('off');
        window['off-button'].classList.add('off');
        setState('ON', true);
    }
});
window['off-button'].addEventListener('click', function () {
    if (getState('ON')) {
        window['on-button'].classList.add('off');
        window['off-button'].classList.remove('off');
        setState('ON', false);
    }
});
window.export.addEventListener('click', function () {
    console.log('export');
});
window.save.addEventListener('click', function () {
    console.log('save');
});
window.reset.addEventListener('click', function () {
    console.log('reset');
});
window['show-outline'].addEventListener('click', function () {
    if (!getState('showOutline')) {
        window['show-outline'].classList.add('hidden');
        window['hide-outline'].classList.remove('hidden');
        setState('showOutline', true);
    }
});
window['hide-outline'].addEventListener('click', function () {
    if (getState('showOutline')) {
        window['show-outline'].classList.remove('hidden');
        window['hide-outline'].classList.add('hidden');
        setState('showOutline', false);
    }
});
window['show-grid'].addEventListener('click', function () {
    if (!getState('showGrid')) {
        window['show-grid'].classList.add('hidden');
        window['hide-grid'].classList.remove('hidden');
        setState('showGrid', true);
    }
});
window['hide-grid'].addEventListener('click', function () {
    if (getState('showGrid')) {
        window['show-grid'].classList.remove('hidden');
        window['hide-grid'].classList.add('hidden');
        setState('showGrid', false);
    }
});
window['show-styles'].addEventListener('click', function () {
    if (!getState('showStyles')) {
        window['show-styles'].classList.add('hidden');
        window['hide-styles'].classList.remove('hidden');
        setState('showStyles', true);
    }
});
window['hide-styles'].addEventListener('click', function () {
    if (getState('showStyles')) {
        window['show-styles'].classList.remove('hidden');
        window['hide-styles'].classList.add('hidden');
        setState('showStyles', false);
    }
});
window['add-image'].addEventListener('click', function () {
    console.log('add-image');
});
window['add-note'].addEventListener('click', function () {
    console.log('add-note');
});
window['add-code'].addEventListener('click', function () {
    console.log('add-code');
});
window['show-help'].addEventListener('click', function () {
    console.log('show-help');
});
