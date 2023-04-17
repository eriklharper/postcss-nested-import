<h1 align="center">PostCSS Nested Import</h1>

<p align="center">PostCSS plugin for importing other stylesheet source files anywhere in your CSS.</p>

<p align="center">
<a href="https://github.com/eriklharper/postcss-nested-import/actions/workflows/test.yml" rel="nofollow noreferrer noopener">
    <img src="https://github.com/eriklharper/postcss-nested-import/actions/workflows/test.yml/badge.svg" alt="GitHub CI test">
  </a>
</p>

Before:

```css
/* vendor.css */
.vendor {
  background: silver;
}

/* index.css */
:global {
  @nested-import './vendor.css';
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
postcss([require("postcss-nested-import")]);
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.
