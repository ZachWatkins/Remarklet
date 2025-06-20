# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added a new `remarklet.restore()` method to restore changes made by the library from localStorage without activating the rest of the library.
- Added a new `remarklet.config` method to set options for the library. This method replaces the `remarklet.options` method and allows for more flexible configuration of the library.
- Added a new `remarklet.unstore()` method to delete all Remarklet data from localStorage. This action cannot be undone.

### Changed

- Deprecated the `remarklet.options` method in favor of `remarklet.config` for setting options. The `remarklet.options` method will be removed in the next major release.
- Updated Rollup from v4.40.2 to v4.41.0.

### Removed

- Removed the console message when the library's `remarklet.options` method is called more than once. The library now allows multiple calls to `remarklet.options` without any warnings.

## [1.2.12] - 2025-05-26

### Fixed

- Fixed TypeScript feature by ensuring the type definitions are included in the published NPM module files.

## [1.2.11] - 2025-05-25

### Added

- Added TypeScript type definitions for the library to improve developer experience and enable better type checking in TypeScript projects.

## [1.2.10] - 2025-05-24

### Fixed

- Reduced the frequency of the console error emitted by the library when `remarklet.options` is called more than once. Now, the error is only emitted once per page load. This is to prevent excessive console noise when the library is used in a development environment.

## [1.2.8] - 2025-05-22

### Fixed

- Fixed an issue with the library where deactivating it did nothing. The library's features should be suppressed upon deactivation.

### Changed

- Updated Rollup from v4.40.2 to v4.41.0.

## [1.2.7] - 2025-05-21

### Fixed

- Fixed an issue with bundlers preventing the library from being built due to the HTMLElement class not being defined during build time.

## [1.2.6] - 2025-05-17

### Added

- Added the documentation website to the v1.2 branch for testing the library on it.

### Fixed

- Fixed an issue on some websites where the hide zone would show but then hide immediately, even when an element was still being dragged.

## [1.2.5] - 2025-05-08

### Fixed

- Fixed an issue where some websites would not show the outline style for the target element.

## [1.2.4] - 2025-05-05

### Fixed

- Fixed image link and syntax error in readme.

## [1.2.3] - 2025-05-05

### Fixed

- Fixed module import error some users may encounter due to interactjs module imports not using fully qualified paths.

## [1.2.2] - 2025-04-27

### Changed

- Changed the background color of the hide zone to 15% opacity black to ensure text is visible.

### Fixed

- Fixed issue with page element mouse events being triggered when initiating or completing drag and resize actions. Also added test for this scenario.

## [1.2.1] - 2025-04-26

### Added

- Added documentation for restore and hide features in README.md.

## [1.2.0] - 2025-04-26

### Added

- Added `remarklet.restore()` which allows users to restore their changes from localStorage without activating the rest of the library. You also do not need to call `remarklet.options({persist:true})` when using `remarklet.restore()`.
- Added a way for users to hide elements from view by dragging an element onto an element labeled "Hide". This hide area is shown while an element is being dragged.
- Added language translation module for "Hide" text.
- Added a Known Issues section to README.md.

## [1.1.1] - 2025-04-13

### Changed

- Changed README.md to note use of options method in the Installation section.

## [1.1.0] - 2025-04-13

### Added

- Added a new opt-in feature using `remarklet.options({ persist: true })` to store the drag and resize changes in localStorage and automatically restore the changes when the page is reloaded.

### Changed

- Inline styles for elements will now be moved to a stylesheet once the operation ends.
- Changing the width or height of a repositioned element no longer affects the position of sibling elements, and dragging the top and left edges of elements which have not been repositioned will no longer affect the position of sibling elements. This is accomplished with margin styles.

## [1.0.9] - 2025-03-29

### Changed

- Fixed issue with touchscreens where an element would only be dragged for a fraction of a second before stopping.

## [1.0.8] - 2025-03-28

### Changed

- Fixed potential issue with element positioning when repeatedly resizing an element.

## [1.0.7] - 2025-03-28

### Added

- Added tests for the resize feature to cover all four edges and both directions of movement for each edge.
- Added test for repeated dragging due to a bug in the drag module.

### Changed

- Moved drag and resize tests from run.spec.js to their own files.
- Fixed issue related to repeat dragging of an element.

## [1.0.6] - 2025-03-27

### Added

- Added translation of element left or right when resizing from the left edge.
- Added instructions to README.md for using the library as a bookmarklet.
- Added automated CSS test to confirm behavior which the library depends on.

### Changed

- Reorganized the installation instructions in README.md to clarify the difference between using the library as a module, a bookmarklet, and using it in your own web page from the CDN.
- Moved source code specific to CSS transforms from drag.js to utils/cssTransforms.js.

### Removed

- Removed use of data attributes `data-remarklet-x` and `data-remarklet-y` for storing the last position of elements being dragged, and `data-remarklet-original-transform` for storing the original computed transform style of the target element. This information is now stored in a private variable.

## [1.0.5] - 2025-03-22

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
