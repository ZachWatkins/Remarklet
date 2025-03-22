# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added instructions for adding and activating the library from any website's developer console.

### Changed

- Improved touch support for dragging and resizing elements.
- Renamed `demo/cdn.html` to `demo/dev.html` to clarify the purpose of the file is to experiment with features during development.
- Split dependencies to reduce uncompressed package size by more than 45kb.

## [1.0.4] - 2025-03-21

### Added

- Added a console warning when users try to resize a rotated element: "Remarklet does not yet support resizing rotated elements."
- Added status badges to the README.md file.
- Added a contributor section to the README.md file.
- Added a stylesheet utility module to handle creating a stylesheet for the library that can receive updates based on state changes.

### Changed

- Resizing will now only set the width or height of the element during the action, not both at the same time.
- Fixed visual issue where resizing elements caused the text inside of elements to be selected.
- Fixed issue where dragging elements did not disable the content editing mode.
- Fixed issue where elements with `box-sizing: content-box` and padding were not resized correctly.

### Removed

- Removed incomplete solution for resizing rotated elements.
- Removed the last file from the docs directory.

## [1.0.3] - 2025-03-18

### Changed

- Fixed the drag module to resolve computed styles of elements which have a pre-existing transform style.
- Fixed issues with tests after changing the demo site.
- Fixed the drag module to resize rotated elements correctly.

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
- Updated README.md to include use of the package from CDNs and a link to the CodePen demo.
- Improved Playwright tests.
- Upgraded Node version from 18.x to 20.x
- Applied code style changes to the codebase using Prettier.

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
