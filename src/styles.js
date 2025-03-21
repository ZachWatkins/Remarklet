/**
 * @module styles
 * Add a stylesheet to the document containing the library's styles.
 */
export default function main() {
    const styles = `
[data-remarklet-highlight] {
    outline: 2px solid #00b3dd;
}
[data-remarklet-dragging],
[data-remarklet-resizing] {
    user-select: none !important;
    -webkit-user-select: none !important;
}
`;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
