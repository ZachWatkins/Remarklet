import remarklet from "@zw/remarklet";
const params = new URLSearchParams(window.location.search);
const options = {
    persist: false,
    hide: false,
};
if (params.get("persist") === "true") {
    options.persist = true;
}
if (params.get("hide") === "true") {
    options.hide = true;
}
remarklet.options(options);
if (new URLSearchParams(window.location.search).get("restore") === "true") {
    remarklet.restore();
} else {
    remarklet.activate();
}
