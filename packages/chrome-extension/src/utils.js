/**
 * This function gets the left and top position offset of an element within the DOM.
 * @param {HTMLElement} element - The element to get the offset of.
 * @returns {{left: number, top: number}} - The left and top position offset of the element.
 */
export function findElementOffset(element) {
    if (element.offsetParent) {
        return {
            left: element.offsetLeft,
            top: element.offsetTop,
        };
    }
    return {
        left: (element.x || element.pageX) - (element.scrollLeft || 0),
        top: (element.y || element.pageY) - (element.scrollTop || 0),
    };
}
