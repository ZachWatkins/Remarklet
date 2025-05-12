import { type Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
    title: "Remarklet",
    tagline: "Edit any web page.",
    // favicon: "img/favicon.ico",
    url: "https://remarklet.com/",
    baseUrl: "/",
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
                            label: "Introduction",
                            to: "/docs/intro",
                        },
                        {
                            label: "Installation",
                            to: "/docs/install",
                        },
                        {
                            label: "Bookmarklet",
                            to: "/docs/bookmarklet",
                        },
                        {
                            label: "API Reference",
                            to: "/docs/api",
                        },
                        {
                            label: "Contributing",
                            to: "/docs/contributing",
                        },
                        {
                            label: "Report an Issue",
                            to: "/docs/report-an-issue",
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
                            label: "Accessibility",
                            to: "/accessibility/"
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/zachwatkins/remarklet",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://zacharywatkins.com">Zach Watkins</a>. Built with <a href="https://docusaurus.io/" nofollow>Docusaurus</a>.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    },
};

export default config;
