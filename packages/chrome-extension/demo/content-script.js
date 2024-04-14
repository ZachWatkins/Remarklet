// chrome.runtime.onMessage.addListener(function (message) {
//     switch (message) {
//         case 'on':
//             activate();
//             break;
//         default:
//             deactivate();
//             break;
//     }
// });

activate();

function activate() {
    document.body.addEventListener('mouseenter', setElement, true);
    document.body.addEventListener('dragstart', handleDragStart, true);
}
function deactivate() {
    document.body.removeEventListener('mouseenter', setElement);
    resetElement();
}

let previousElement = null;
let previousElementPreviousState = null;
let currentElement = null;
let currentElementPreviousState = null;
let dragStart = null;

function handleDragStart(event) {
    if (event.target === document.body || event.target !== currentElement) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    // Track mouse delta for fluid change in position.
    dragStart = {
        x: event.clientX,
        y: event.clientY,
    };
}

function handleDragEnd(event) {
    if (event.target === document.body || event.target !== currentElement) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();

    // Calculate the delta between the start and end of the drag.
    const delta = {
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
    };

    // Use CSS to move the element.
    moveCurrentElement(delta);
}

function moveCurrentElement(delta) {
    const rect = currentElement.getBoundingClientRect();
    currentElement.style.position = 'absolute';
    currentElement.style.left = `${rect.left + delta.x}px`;
    currentElement.style.top = `${rect.top + delta.y}px`;
}

function setElement(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target === document.body) {
        resetElement();
        return;
    }
    if (currentElement) {
        previousElement = currentElement;
        previousElementPreviousState = currentElementPreviousState;
        previousElement.style.outline = previousElementPreviousState.outline;
        if (previousElementPreviousState.draggable === null) {
            previousElement.removeAttribute('draggable');
        } else {
            previousElement.setAttribute(
                'draggable',
                previousElementPreviousState.draggable,
            );
        }
        currentElement = event.target;
        currentElementPreviousState = {
            draggable: currentElement.getAttribute('draggable'),
            outline: currentElement.style.outline,
        };
        currentElement.style.outline = '2px solid red';
        currentElement.setAttribute('draggable', 'true');
        return;
    }
    currentElement = event.target;
    currentElementPreviousState = {
        draggable: currentElement.getAttribute('draggable'),
        outline: currentElement.style.outline,
    };
    currentElement.style.outline = '2px solid red';
    currentElement.setAttribute('draggable', 'true');
}

function resetElement() {
    if (previousElement) {
        previousElement.style.outline = previousElementPreviousState.outline;
        if (previousElementPreviousState.draggable === null) {
            previousElement.removeAttribute('draggable');
        } else {
            previousElement.setAttribute(
                'draggable',
                previousElementPreviousState.draggable,
            );
        }
    }
    if (currentElement) {
        currentElement.style.outline = currentElementPreviousState.outline;
        if (currentElementPreviousState.draggable === null) {
            currentElement.removeAttribute('draggable');
        } else {
            currentElement.setAttribute(
                'draggable',
                currentElementPreviousState.draggable,
            );
        }
    }
}

function preventEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

// function logMouseMove(e) {
//     chrome.runtime.sendMessage({
//         type: 'log',
//         name: 'mousemove',
//         options: { x: e.clientX, y: e.clientY },
//     });
// }
