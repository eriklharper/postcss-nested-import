# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.1.0 (2023-08-10)

### Features

- enable import from `node_modules` - thanks [Kristoffer Nordström](https://github.com/42tte)
- allow use of CSS [url() function syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/url) - thanks [Kristoffer Nordström](https://github.com/42tte)

For example:

```css
@nested-import url("./test/mocks/colors2.css");
h1 {
  color: red;
}
```

### Fixes

- updated dependencies, fixed all dependabot alerts

## 1.0.0 (2023-04-17)

- renamed the API — from `@import` to `@nested-import`, to prevent clashes with [`postcss-import`](https://github.com/postcss/postcss-import) plugin
- updated dependencies

## 0.2.0 (2022-02-10)

- added `c8` for coverage and uvu for unit tests
- enforces 100% coverage
- removed `jest`
- removed `console.log` which reports contents of the resolved `@import`
- moved mock test files into subfolder within `test/mocks/` (previously mock vendors.css was shipping to npm)
- updated to the latest v8 PostCSS (set as peer dependency)
  improved the algorithm to account for both single and double and missing quotes within `@import`
- improved the algorithm to try-catch fs errors and report them properly
- removed Travis, added GH actions
- yarn is assumed to be the preferred over npm, but added npm lockfile to gitignore and `.npmrc` just in case somebody forks and tries to run it using npm i
- added `prettier` and `eslint` to trigger VSCode to format/lint the code (previous setup wasn't picked up by VSCode plugins)
- committed a fresh yarn lock file (GH actions will expect it too)

Closes issues #2, #3, #4, #5.

## 0.1.0 (2017-04-21)

- Basic nested import functionality
