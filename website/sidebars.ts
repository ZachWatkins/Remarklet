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
    docsSidebar: [
        {
            type: "doc",
            id: "intro", // Link to intro.md (or the first doc)
            label: "Introduction",
        },
        {
            type: "doc",
            id: "install",
            label: "Installation",
        },
        {
            type: "doc",
            id: "bookmarklet",
            label: "Bookmarklet",
        },
        {
            type: "doc",
            id: "changelog",
            label: "Changelog",
        },
        {
            type: "link",
            href: "contributing",
            label: "Contributing",
        },
        {
            type: "doc",
            id: "report-an-issue",
            label: "Report an Issue",
        },
    ],
    apiSidebar: [
        {
            type: "doc",
            id: "api",
            label: "Client API",
        },
    ],
    communitySidebar: [
        {
            type: "doc",
            id: "contributing",
            label: "Contributing",
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
