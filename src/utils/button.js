export default function Button() {
    this.element = document.createElement("button");
    this.element.setAttribute("aria-label", "Hide");
    this.element.setAttribute("title", "Hide Element");
    this.element.setAttribute("type", "button");
    this.element.setAttribute("data-remarklet-control", "true");
    this.element.innerHTML = "Hide";
    this.isActive = false;
    this.activeStyles = {
        pointerEvents: "auto",
        touchAction: "auto",
        userSelect: "auto",
        opacity: "1",
    };
    this.inactiveStyles = {
        pointerEvents: "none",
        touchAction: "none",
        userSelect: "none",
        opacity: "0",
    };
    Object.assign(this.element.style, {
        position: "absolute",
        zIndex: "9999",
        backgroundColor: "red",
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "opacity 0.3s ease",
        borderRadius: "5px",
        fontSize: "12px",
        lineHeight: "40px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        boxSizing: "border-box",
        width: "40px",
        height: "40px",
        whiteSpace: "nowrap",
        ...this.inactiveStyles,
    });
    this.moveTo = (element) => {
        const rect = element.getBoundingClientRect();
        const newLeft = `${rect.right + window.scrollX - 40}px`;
        const newTop = `${rect.top + window.scrollY}px`;
        if (
            this.element.style.left !== newLeft ||
            this.element.style.top !== newTop
        ) {
            this.element.style.left = newLeft;
            this.element.style.top = newTop;
        }
    };
    this.activate = () => {
        if (this.isActive) {
            return;
        }
        Object.assign(this.element.style, this.activeStyles);
        this.isActive = true;
    };
    this.deactivate = () => {
        if (!this.isActive) {
            return;
        }
        console.log("deactivate");
        Object.assign(this.element.style, this.inactiveStyles);
        this.isActive = false;
    };
    document.body.appendChild(this.element);
}
