import remarklet from '@zw/remarklet';
document.getElementById('activate').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    remarklet.activate();
});
document.getElementById('deactivate').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    remarklet.deactivate();
});

