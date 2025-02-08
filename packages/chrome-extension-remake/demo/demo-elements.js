// Generate all interactable HTML elements to use in testing mouse interaction events.
const text = 'foo';
const elements = [];
elements[0] = document.createElement('div');
elements[0].innerHTML = text;

export function addElements(root) {
    for (let i = 0; i < elements.length; i++) {
        root.appendChild(elements[i]);
    }
}
