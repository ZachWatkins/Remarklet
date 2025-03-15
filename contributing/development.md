# Development

Once you've installed Node.js (which includes the popular `npm` package manager), open your terminal and run the following:

```sh
git clone https://github.com/zachwatkins/remarklet
cd remarklet
npm ci
```

This will clone the repository and install the dependencies.

If you want to see Remarklet in action, you can run the demo site locally:

```sh
cd demo
npm ci
npm run dev
```

This will start a local development server which runs at `http://localhost:3000` and imports the main file at `index.js`.

## Cross Platform Development

To maintain this project while allowing as many people as possible to contribute, it's important to keep in mind the different environments that people may be using to develop on.

We will use coding conventions described in this section to improve cross-platform compatibility.

### Line Endings

Line endings are a common source of problems when working on cross-platform projects. Windows uses `CRLF` line endings, while Unix-based systems (like Linux and macOS) use `LF` line endings.
To avoid issues with line endings, we recommend using `LF` line endings in your code. Most modern text editors and IDEs can be configured to use `LF` line endings by default.
To ensure that your code is using `LF` line endings, you can use the following command in your terminal:

```sh
git config --global core.autocrlf input
```

This will configure Git to automatically convert `CRLF` line endings to `LF` when you commit your code, and convert `LF` line endings to `CRLF` when you check out your code on Windows.
This way, you can work on your code in a cross-platform environment without worrying about line endings causing issues.
