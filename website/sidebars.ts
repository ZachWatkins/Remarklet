import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
    "v1.2.x": [
        {
            type: "doc",
            id: "1.2.x/index",
            label: "Introduction",
        },
        {
            type: "doc",
            id: "1.2.x/install",
            label: "Installation",
        },
        {
            type: "doc",
            id: "1.2.x/bookmarklet",
            label: "Bookmarklet",
        },
        {
            type: "doc",
            id: "1.2.x/api",
            label: "Client API",
        },
    ],
    docsSidebar: [
        {
            type: "doc",
            id: "changelog",
            label: "Changelog",
        },
    ],
    communitySidebar: [
        {
            type: "doc",
            id: "support",
            label: "Support",
        },
        {
            type: "doc",
            id: "contributing",
            label: "Contributing",
        },
        {
            type: "doc",
            id: "code-of-conduct",
            label: "Code of Conduct",
        },
        {
            type: "doc",
            id: "changelog",
            label: "Changelog",
        },
        {
            type: "doc",
            id: "report-an-issue",
            label: "Report an Issue",
        },
    ],
};

export default sidebars;
