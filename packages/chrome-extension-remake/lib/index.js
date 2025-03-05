import { setMode } from "./global.js";

export function activate() {
    setMode("dragging");
}
export function deactivate() {
    setMode("");
}
