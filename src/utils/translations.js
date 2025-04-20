const dict = {
    // English.
    en: {
        Hide: "Hide",
    },
    // Afrikaans.
    af: {
        Hide: "Versteek",
    },
    // Arabic.
    ar: {
        Hide: "مرحبا",
    },
    // German.
    de: {
        Hide: "Verstecken",
    },
    // Espanol.
    es: {
        Hide: "Esconder",
    },
    // French.
    fr: {
        Hide: "Cacher",
    },
    // Hindi.
    hi: {
        Hide: "छिपाना",
    },
    // Japanese.
    ja: {
        Hide: "隠れる",
    },
    // Korean.
    ko: {
        Hide: "숨다",
    },
    // Chinese.
    zh: {
        Hide: "隐藏",
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
