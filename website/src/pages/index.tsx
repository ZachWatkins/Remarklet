import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import remarklet from "@zw/remarklet";
import CodeBlock from "@theme/CodeBlock";
import styles from "./index.module.css";

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

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!active) {
            document.body.addEventListener("mousedown", activateRemarklet, {
                capture: true,
            });
            document.body.removeEventListener(
                "mousedown",
                deactivateRemarklet,
                {
                    capture: true,
                },
            );
        } else {
            document.body.addEventListener("mousedown", deactivateRemarklet, {
                capture: true,
            });
            document.body.removeEventListener("mousedown", activateRemarklet, {
                capture: true,
            });
        }
        return () => {
            document.body.removeEventListener("mousedown", activateRemarklet, {
                capture: true,
            });
            document.body.removeEventListener(
                "mousedown",
                deactivateRemarklet,
                {
                    capture: true,
                },
            );
        };
    }, [active]);

    return (
        <header className={clsx("hero hero--primary", styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">
                    {siteConfig.tagline}
                    <Link
                        id="activate"
                        className="button button--secondary button--lg"
                        style={{ marginLeft: 16 }}
                        onMouseDown={() => {
                            setActive(!active);
                        }}
                    >
                        {active ? "Deactivate Demo" : "Activate Demo"}
                    </Link>
                </p>
                <div>
                    <p>
                        To use it like an extension, paste the code below into
                        your browser's address bar:
                    </p>
                    <CodeBlock
                        language="html"
                        className={styles.bookmarkletCode}
                    >
                        {`javascript:(function(){const script=document.createElement('script');script.src='https://unpkg.com/@zw/remarklet/dist/remarklet.min.js';document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();`}
                    </CodeBlock>
                </div>
                <p>
                    Install the npm package to use it in your own applications:
                </p>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 16,
                    }}
                >
                    <CodeBlock language="shell">
                        {`$ npm install @zw/remarklet`}
                    </CodeBlock>
                    <CodeBlock language="shell">
                        {`$ yarn add @zw/remarklet`}
                    </CodeBlock>
                    <CodeBlock language="shell">
                        {`$ pnpm add @zw/remarklet`}
                    </CodeBlock>
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
