import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import remarklet from "@zw/remarklet";
import { Icon } from "@iconify/react"; // Added import

remarklet.options({
    hide: true,
});
function activateRemarklet(e) {
    if (e.target.id === "activate") {
        remarklet.activate();
    }
}
function deactivateRemarklet(e) {
    if (e.target.id === "activate") {
        remarklet.deactivate();
    }
}

import styles from "./index.module.css";

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    // State for NPM copy notification
    const [npmCopied, setNpmCopied] = useState(false);

    useEffect(() => {
        if (!active) {
            document.body.addEventListener("click", activateRemarklet, {
                capture: true,
            });
            document.body.removeEventListener("click", deactivateRemarklet, {
                capture: true,
            });
        } else {
            document.body.addEventListener("click", deactivateRemarklet, {
                capture: true,
            });
            document.body.removeEventListener("click", activateRemarklet, {
                capture: true,
            });
        }
        return () => {
            document.body.removeEventListener("click", activateRemarklet, {
                capture: true,
            });
            document.body.removeEventListener("click", deactivateRemarklet, {
                capture: true,
            });
        };
    }, [active]);

    return (
        <header className={clsx("hero hero--primary", styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons + " " + styles.gap4}>
                    <Link
                        id="activate"
                        className="button button--secondary button--lg"
                        onClick={() => {
                            setActive(!active);
                        }}
                    >
                        {active ? "Deactivate" : "Activate"}
                    </Link>
                    <div className={styles.buttonWrapper}>
                        <div
                            aria-hidden={!copied}
                            className={
                                styles.copyNotification +
                                (copied
                                    ? ""
                                    : ` ${styles.copyNotificationHidden}`)
                            }
                        >
                            Copied!
                        </div>
                        <Link
                            className={
                                styles.buttonWrapperButton +
                                " button button--secondary button--lg"
                            }
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    "javascript:(function(){const script=document.createElement('script');script.src='https://unpkg.com/@zw/remarklet/dist/remarklet.min.js';document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();",
                                );
                                setCopied(true);
                                window.setTimeout(() => {
                                    setCopied(false);
                                }, 1500);
                            }}
                        >
                            Get the Bookmark
                        </Link>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 16,
                    }}
                >
                    <code
                        id="npm-install-command"
                        style={{
                            background: "#f5f5f5",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            fontSize: 16,
                            display: "flex", // Added for button alignment
                            alignItems: "center", // Added for button alignment
                            justifyContent: "space-between", // Added for button alignment
                        }}
                    >
                        $ npm install remarklet
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    "npm install remarklet",
                                );
                                setNpmCopied(true);
                                window.setTimeout(
                                    () => setNpmCopied(false),
                                    1500,
                                );
                            }}
                            style={{
                                padding: "6.4px",
                                marginLeft: "16px",
                                backgroundColor: "transparent",
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                boxSizing: "border-box",
                                color: "#fff",
                                borderRadius: "6.4px",
                                cursor: "pointer",
                                fontSize: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                opacity: 0.7,
                            }}
                            aria-label="Copy NPM install command"
                        >
                            {npmCopied ? (
                                "Copied!"
                            ) : (
                                <Icon icon="mdi:content-copy" width="18" />
                            )}
                        </button>
                    </code>
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title="Edit any web page"
            description="Description will go into a meta tag in <head />"
        >
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
