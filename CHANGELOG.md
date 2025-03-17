# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes are available.

## [1.0.2] - 2025-03-15

### Added

- Added Rollup development dependency to bundle the library for use directly in browsers:
  - `<script src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js"></script>`  
  - `<script src="https://cdn.jsdelivr.net/npm/@zw/remarklet/dist/remarklet.min.js"></script>`  
- `remarklet.version` identifies the version number of the package during runtime.
- Added contribution guidelines and security documentation.
- Added CI workflow.
- Added Prettier development dependency for code formatting.

### Changed

- Demo site now uses a CSS Zen Garden theme to better communicate the need for being able to easily reposition and resize page elements.
- Updated the README to include use of the package from CDNs and a link to the CodePen demo.
- Improved Playwright tests.
- Upgraded Node version from 18.x to 20.x

### Removed

- Removed the documentation website in favor of using a separate repository.

## [1.0.1] - 2025-03-12

### Removed

- Removed test files from the NPM package.

## [1.0.0] - 2025-03-09

### Added

- First major release of the project.
- Basic functionality for the main features of dragging and resizing elements and editing their text.
- Documentation for installation and usage.
- License file for the project.

## [0.9.0] - 2015-03-05

### Added

- Initial release of the project.
- Basic functionality for dragging and resizing elements, copying elements, editing text, and storing the state of the page.
- Packaged as a JavaScript bookmarklet.
- Used jQuery and jQuery UI for drag and resize functionality, and rangyinputs for text editing controls.
