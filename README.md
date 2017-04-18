# PostCSS Nested Import [![Build Status][ci-img]][ci]

[PostCSS] plugin for importing other stylesheet source files anywhere in your CSS.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/eriklharper/postcss-nested-import.svg
[ci]:      https://travis-ci.org/eriklharper/postcss-nested-import

Before:
```css
/* vendor.css */
.vendor {
  background: silver;
}

/* index.css */
:global {
  @import './vendor.css';
}
```
After:
```css
:global {
  .vendor {
    background: silver;
  }
}
```

## Usage

```js
postcss([
  require('postcss-nested-import')
])
```

See [PostCSS] docs for examples for your environment.
