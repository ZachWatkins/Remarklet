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
                <h1 className="hero__title mx-auto">{siteConfig.title}</h1>
                <div className="flex flex-column sm:flex-row flex-center mb-2">
                    <div className="hero__subtitle">{siteConfig.tagline}</div>
                    <Link
                        id="activate"
                        className="sm:ml-2 mt-2 sm:mt-0 button button--secondary button--lg"
                        onMouseDown={() => {
                            setActive(!active);
                        }}
                    >
                        {active ? "Deactivate Demo" : "Activate Demo"}
                    </Link>
                </div>
                <div>
                    <div className="mb-1">
                        Just run this in your browser's address bar (and
                        double-check that "javascript:" is at the start):
                    </div>
                    <CodeBlock
                        language="html"
                        className={styles.bookmarkletCode}
                    >
                        {`javascript:(function(){let script=document.createElement('script');script.src='https://unpkg.com/@zw/remarklet/dist/remarklet.min.js';document.head.appendChild(script);script.onload=()=>{remarklet.options({hide:true});remarklet.activate()}})();`}
                    </CodeBlock>
                    <div style={{ marginTop: "-12px" }}>
                        Or save it as a bookmark URL and then click to
                        activate it. Example:{" "}
                        <a
                            style={{
                                color: "#FFF",
                                textDecoration: "underline",
                                fontWeight: "bold",
                            }}
                            href="javascript:(function(){let script=document.createElement('script');script.src='https://unpkg.com/@zw/remarklet/dist/remarklet.min.js';document.head.appendChild(script);script.onload=()=>{remarklet.options({hide:true});remarklet.activate()}})();"
                        >
                            Remarklet
                        </a>
                        .
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
            title="Edit any web page"
            description="Description will go into a meta tag in <head />"
        >
            <HomepageHeader />
            <main>
                <HomepageFeatures />
                <section className="container">
                    <div className="row">
                        <div className="col">
                            <p className="padding-horiz--md">
                                Remarklet is the fastest way for product
                                managers and UI/UX designers to communicate and
                                test ideas directly on live web pages - without
                                waiting on dev cycles or digging into code.
                                Whether you're suggesting a new layout, tweaking
                                copy for clarity, or reviewing a user flow,
                                Remarklet lets you visually edit, rearrange, and
                                annotate any website in seconds. It’s perfect
                                for stakeholder reviews, prototyping in context,
                                and bridging the gap between vision and
                                implementation.
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className="padding-horiz--md">
                                It was created by a web developer with an art
                                degree to be the easiest way to mock up changes
                                to your existing website.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
