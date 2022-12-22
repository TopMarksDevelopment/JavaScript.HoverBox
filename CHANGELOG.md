<!--
Guiding Principles
- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.
- Mention whether you follow Semantic Versioning.

Types of changes
- Added for new features.
- Changed for changes in existing functionality.
- Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.
- Breaking changes for break in new revision
- Other for notable changes that do not
 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2022-12-22

<small>[Compare to previous release][comp:2.0.0]</small>

### Breaking changes

-   Migrated to the generic `@topmarksdevelopment/position`. Breaking as underlying types have changed:
    -   `PositionAlignment` => `Alignment`
    -   `PositionCollision` => `CollisionHandler`

### Changed

-   Now released as a `UMD`, `CJS` and `ES` module packages, for better support

### Other

-   Added tests to check basic functionality (plan to extend in the future)
-   Added workflows for auto releases to NPM and GitHub pages
-   Tidied readme
-   Other changes (nothing user facing)

## [1.0.1] - 2022-05-19

<small>[Compare to previous release][comp:1.0.1]</small>

### Fixed

-   Fixed an issue where dragging back onto an element before its timeout fired would cancel the old hide queue but not re-queue it [#4](https://github.com/TopMarksDevelopment/JavaScript.HoverBox/pull/4)

### Updated

-   `@topmarksdevelopment/hover-position` from `1.0.0` to `1.0.1`
    -   Fixed position when the anchor is inside a scrollable element [hover-position#4](https://github.com/TopMarksDevelopment/JavaScript.HoverPosition/pull/4)
    -   Other changes (nothing user facing)

## [1.0.0] - 2022-05-12

**This was the first release**

[2.0.0]: https://github.com/TopMarksDevelopment/JavaScript.HoverBox/release/tag/v2.0.0
[comp:2.0.0]: https://github.com/TopMarksDevelopment/JavaScript.HoverBox/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/TopMarksDevelopment/JavaScript.HoverBox/release/tag/v1.0.1
[comp:1.0.1]: https://github.com/TopMarksDevelopment/JavaScript.HoverBox/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/TopMarksDevelopment/JavaScript.HoverBox/release/tag/v1.0.0
