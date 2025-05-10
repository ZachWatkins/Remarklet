import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import remarklet from "@zw/remarklet";

import styles from "./index.module.css";

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    const [copied, setCopied] = useState(false);
    return (
        <header className={clsx("hero hero--primary", styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons + " " + styles.gap4}>
                    <Link
                        className="button button--secondary button--lg"
                        onClick={() => {
                            remarklet.activate();
                        }}
                    >
                        Activate
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
                            className={styles.buttonWrapperButton + " button button--secondary button--lg"}
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
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
