const dict = {
    en: {
        hide: "Hide",
    },
    fr: {
        hide: "Cacher",
    },
    es: {
        hide: "Ocultar",
    },
    de: {
        hide: "Verstecken",
    },
};
const events = [];
let listening = false;
export default function main(str) {
    if (!listening) {
        window.addEventListener("languagechange", handleLanguageChange);
        listening = true;
    }
    const userLanguagePreference = navigator.language || "en";
    if (!dict[userLanguagePreference]) {
        return dict.en[str] || str;
    }
    return dict[userLanguagePreference][str] || str;
}
main.subscribe = function (callback) {
    events.push(callback);
};
function handleLanguageChange() {
    const newLang = navigator.language;
    if (dict[newLang]) {
        events.forEach((callback) => callback());
    }
}
