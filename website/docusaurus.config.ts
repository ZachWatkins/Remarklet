import { type Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
    title: "Remarklet",
    tagline: "Edit any web page.",
    favicon: "img/favicon.ico",
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
                    sidebarId: "v1.2.x",
                    position: "left",
                    label: "Documentation",
                },
                {
                    type: "docSidebar",
                    sidebarId: "communitySidebar",
                    position: "left",
                    label: "Community",
                },
                {
                    href: "https://npmjs.com/package/@zw/remarklet",
                    position: "right",
                    className: "header-npm-link",
                    "aria-label": "NPM package",
                },
                {
                    href: "https://github.com/ZachWatkins/Remarklet",
                    position: "right",
                    className: "header-github-link",
                    "aria-label": "GitHub repository",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Documentation",
                    items: [
                        {
                            label: "Introduction",
                            to: "/docs/1.2.x/",
                        },
                        {
                            label: "Installation",
                            to: "/docs/1.2.x/install",
                        },
                        {
                            label: "Bookmarklet",
                            to: "/docs/1.2.x/bookmarklet",
                        },
                        {
                            label: "API Reference",
                            to: "/docs/1.2.x/api",
                        },
                        {
                            label: "Changelog",
                            to: "docs/changelog",
                        },
                    ],
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "Support",
                            to: "docs/support",
                        },
                        {
                            label: "Contributing",
                            to: "docs/contributing",
                        },
                        {
                            label: "Code of Conduct",
                            to: "docs/code-of-conduct",
                        },
                        {
                            label: "Report an Issue",
                            to: "docs/report-an-issue",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "Accessibility",
                            to: "/accessibility/",
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
