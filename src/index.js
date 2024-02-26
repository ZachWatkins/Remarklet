import './index.scss';
// import menu from './menu.js';
const state = {
    on: false,
    viewGrid: false,
    viewOutline: false,
};
window['on-button'].addEventListener('click', function () {
    if (!state.on) {
        window['on-button'].classList.remove('off');
        window['off-button'].classList.add('off');
        state.on = true;
    }
});
window['off-button'].addEventListener('click', function () {
    if (state.on) {
        window['on-button'].classList.add('off');
        window['off-button'].classList.remove('off');
        state.on = false;
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
window['view-outlines'].addEventListener('click', function () {
    if (!state.viewOutline) {
        window['view-outlines'].classList.add('hidden');
        window['hide-outlines'].classList.remove('hidden');
        state.viewOutline = true;
    }
});
window['hide-outlines'].addEventListener('click', function () {
    if (state.viewOutline) {
        window['view-outlines'].classList.remove('hidden');
        window['hide-outlines'].classList.add('hidden');
        state.viewOutline = false;
    }
});
window['view-grid'].addEventListener('click', function () {
    if (!state.viewGrid) {
        window['view-grid'].classList.add('hidden');
        window['hide-grid'].classList.remove('hidden');
        state.viewGrid = true;
    }
});
window['hide-grid'].addEventListener('click', function () {
    if (state.viewGrid) {
        window['view-grid'].classList.remove('hidden');
        window['hide-grid'].classList.add('hidden');
        state.viewGrid = false;
    }
});
window['view-css'].addEventListener('click', function () {
    console.log('view-css');
});
window['add-image'].addEventListener('click', function () {
    console.log('add-image');
});
window['add-note'].addEventListener('click', function () {
    console.log('add-note');
});
window['add-html'].addEventListener('click', function () {
    console.log('add-html');
});
window['view-help'].addEventListener('click', function () {
    console.log('view-help');
});
