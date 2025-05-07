import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
    title: string;
    Svg?: React.ComponentType<React.ComponentProps<"svg">>;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: "Easy to Use",
        description: (
            <>
                Remarklet was designed from the ground up to be easy to install
                and use.
            </>
        ),
    },
    {
        title: "Save & Restore",
        description: (
            <>
                Remarklet lets you save and restore changes in your browser's
                local storage.
            </>
        ),
    },
    {
        title: "Touchscreen Compatible",
        description: (
            <>
                Powered by interact.js, Remarklet's features can be used on
                touchscreen devices.
            </>
        ),
    },
];

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx("col col--4")}>
            {Svg && (
                <div className="text--center">
                    <Svg className={styles.featureSvg} role="img" />
                </div>
            )}
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
