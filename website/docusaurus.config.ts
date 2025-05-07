import { type Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
    title: "Remarklet",
    tagline: "Edit any web page.",
    // favicon: "img/favicon.ico",
    url: "https://zacharywatkins.com/",
    baseUrl: "/Remarklet/",
    organizationName: "zachwatkins",
    projectName: "remarklet",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    editUrl:
                        "https://github.com/zachwatkins/remarklet/tree/main/website/",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            },
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        // image: "img/docusaurus-social-card.jpg", // You might want to create a social card image
        navbar: {
            title: "Remarklet",
            logo: {
                alt: "Remarklet Logo",
                src: "img/logo.svg", // You might want to create a logo
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "tutorialSidebar",
                    position: "left",
                    label: "Docs",
                },
                {
                    href: "https://github.com/ZachWatkins/Remarklet",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "API Reference",
                            to: "/docs/intro",
                        },
                    ],
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "GitHub Discussions",
                            to: "https://github.com/zachwatkins/remarklet/discussions",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/zachwatkins/remarklet",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Zach Watkins. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    },
};

export default config;
