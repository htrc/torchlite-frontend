# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.4] – 2025-05-19

### Added
- Dialog component that displays error messages to the user to explain why widgets aren't loading
- Error message for loading a shared link to a dashbaord using private workset while unauthenticated
- Error message for when the workset an authenticated user has been working on has been removed since they last logged in.
- Error message when trying to load a workset where none of the HTIDs are in TORCHLITE
- Error message for when Analytics Gateway is inaccessible

### Fixed
- Bug where logging out while viewing a private workset would try to load the same workset while unauthenticated. Now logouts redirect to the default URL.

## [0.2.3] – 2025-02-26

### Changed
- Names of some widgets and workset sections. [#85](https://github.com/htrc/torchlite-app/issues/85)
- Max public or user workset size dropped to 400 volumes. [#78](https://github.com/htrc/torchlite-app/issues/78) 

### Fixed
- Error handling for unauthorized or non-existent workset, should now throw meaningful error [#146](https://github.com/htrc/torchlite-backend/issues/146)

## [0.2.2] – 2025-02-12

### Fixed
- Fix widgets not getting displayed after user refresh token expires by signing out user. [#98](https://github.com/htrc/torchlite-frontend/issues/98)  

## [0.2.1] – 2025-01-29

### Added
- Google Analytics code [#156](https://github.com/htrc/torchlite-frontend/issues/156)

## [0.2.0] – 2025-01-06

### Added
- Disable buttons on sidebar until all widgets have loaded and whenever widgets are reloaded from a change 
- Download indicator and message for Download the Data [#131](https://github.com/htrc/torchlite-frontend/issues/131)
- Full functionality for Download the Data by calling the endpoint on the backend [#120](https://github.com/htrc/torchlite-backend/issues/120)

### Changed
- Merged changes from stage. [#147](https://github.com/htrc/torchlite-frontend/issues/147)
- Download the Data interface to have only three options [#129](https://github.com/htrc/torchlite-frontend/issues/129)

### Removed

- CSV Download the Data options [#129](https://github.com/htrc/torchlite-frontend/issues/129)

## [0.1.0] – 2024-12-09

### Added

- This CHANGELOG file.
- Share button and popup [#61](https://github.com/htrc/torchlite-app/issues/61)

[unreleased]: https://github.com/htrc/torchlite-frontend/compare/0.2.4...HEAD
[0.2.4]: https://github.com/htrc/torchlite-frontend/compare/0.2.3...0.2.4
[0.2.3]: https://github.com/htrc/torchlite-frontend/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/htrc/torchlite-frontend/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/htrc/torchlite-frontend/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/htrc/torchlite-frontend/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/htrc/torchlite-frontend/releases/tag/0.1.0
