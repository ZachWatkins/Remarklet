import state from "./state.js";
import { getUniqueSelector } from "./utils/cssSelector";
import LocalStorageItem from "./utils/LocalStorageItem";
const elementChangeMap = new WeakMap();
const store =
    state.get("persist") === true
        ? new LocalStorageItem({
              key: "remarklet-changemap",
              type: "object",
              defaultValue: {},
          })
        : null;

export function has(target) {
    return elementChangeMap.has(target);
}

export function get(target) {
    return elementChangeMap.get(target);
}

export function set(target, value) {
    elementChangeMap.set(target, value);
    if (store) {
        const selector = getUniqueSelector(target, {
            excludeDataAttributePrefix: "remarklet",
        });
        store.value[selector] = value;
        store.store();
    }
}

export function sync(target) {
    if (!store) {
        return;
    }
    const selector = getUniqueSelector(target, {
        excludeDataAttributePrefix: "remarklet",
    });
    store.value[selector] = elementChangeMap.get(target);
    store.store();
}

export function init(target, mode) {
    if (elementChangeMap.has(target)) {
        return;
    }
    const selector = getUniqueSelector(target, {
        excludeDataAttributePrefix: "remarklet",
    });
    if (!store) {
        elementChangeMap.set(target, {
            initialStyle: target.style.cssText.replace(/cursor:[^;]+;?/g, ""),
            delta: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            dragged: mode === "dragged",
            resized: mode === "resized",
            selector,
            style: {},
            getStyleRule() {
                const styles = this.style;
                let rule = [];
                for (const key in styles) {
                    if (styles[key] === null) {
                        continue;
                    }
                    const kebabKey = key.replace(
                        /([A-Z])/g,
                        (match) => `-${match.toLowerCase()}`,
                    );
                    rule.push(`${kebabKey}: ${styles[key]}`);
                }
                if (rule.length === 0) {
                    return "";
                }
                return rule.join(";\n") + ";";
            },
        });
        return;
    }
    const previousSession = store.value[selector];
    if (!previousSession) {
        elementChangeMap.set(target, {
            initialStyle: target.style.cssText.replace(/cursor:[^;]+;?/g, ""),
            delta: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            dragged: mode === "dragged",
            resized: mode === "resized",
            selector,
            style: {},
            getStyleRule() {
                const styles = this.style;
                let rule = [];
                for (const key in styles) {
                    if (styles[key] === null) {
                        continue;
                    }
                    const kebabKey = key.replace(
                        /([A-Z])/g,
                        (match) => `-${match.toLowerCase()}`,
                    );
                    rule.push(`${kebabKey}: ${styles[key]}`);
                }
                if (rule.length === 0) {
                    return "";
                }
                return rule.join(";\n") + ";";
            },
        });
        store.value[selector] = elementChangeMap.get(target);
        store.store();
        return;
    }
    elementChangeMap.set(target, {
        ...JSON.parse(JSON.stringify(previousSession)),
        [mode]: true,
        getStyleRule() {
            const styles = this.style;
            let rule = [];
            for (const key in styles) {
                if (styles[key] === null) {
                    continue;
                }
                const kebabKey = key.replace(
                    /([A-Z])/g,
                    (match) => `-${match.toLowerCase()}`,
                );
                rule.push(`${kebabKey}: ${styles[key]}`);
            }
            if (rule.length === 0) {
                return "";
            }
            return rule.join(";\n") + ";";
        },
    });
    store.value[selector] = elementChangeMap.get(target);
    store.store();
}

function getStyleRule() {
    const styles = this.style;
    let rule = [];
    for (const key in styles) {
        if (styles[key] === null) {
            continue;
        }
        const kebabKey = key.replace(
            /([A-Z])/g,
            (match) => `-${match.toLowerCase()}`,
        );
        rule.push(`${kebabKey}: ${styles[key]}`);
    }
    if (rule.length === 0) {
        return "";
    }
    return rule.join(";\n") + ";";
}

export default {
    has,
    get,
    set,
    init,
    getStyleRule,
    sync,
};
