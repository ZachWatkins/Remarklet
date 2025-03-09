/**
 * @module styles
 * Add a stylesheet to the document containing the library's styles.
 */
export default function main() {
    const styles = `
.remarklet-highlight {
    outline: 2px solid #00b3dd;
}
`;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
