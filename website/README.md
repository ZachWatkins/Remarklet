# Remarklet Website

This website is built using [Docusaurus](https://docusaurus.io/), a static website generator.

It uses Playwright and Axe to run accessibility tests on the website. The tests are run in a GitHub Action workflow, and the results are reported in the GitHub Actions tab.

The API documentation is generated using JSDoc and is hosted on GitHub Pages at https://remarklet.com.

## Local Development

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

This website is automatically deployed using GitHub Actions.
