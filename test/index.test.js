let path = require("path");
let { test } = require("uvu");
let { equal, match } = require("uvu/assert");
let postcss = require("postcss");

let nestedImport = require("../");

// -----------------------------------------------------------------------------

async function run(input, output, opts, from) {
  let result = await postcss([nestedImport(opts)]).process(input, {
    from
  });
  equal(result.css, output);
  equal(result.warnings().length, 0);
  return result;
}

async function catchError(fn) {
  let error;
  try {
    await fn();
  } catch (e) {
    error = e;
  }
  return error;
}

// -----------------------------------------------------------------------------

test("01 - replaces one instance of @nested-import", async () => {
  await run(
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import './test/mocks/colors1.css';
  }
}`,
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    h1 {
  color: red;
}
  }
}`
  );
});

test("02 - two instances, different quote styles", async () => {
  await run(
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import './test/mocks/colors1.css';
    @nested-import "./test/mocks/colors2.css";
    @nested-import ./test/mocks/colors1.css;
  }
}`,
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    h1 {
  color: red;
}
    h1 {
  color: blue;
}
    h1 {
  color: red;
}
  }
}`
  );
});

test("03 - only @import in one line", async () => {
  await run(
    `@nested-import './test/mocks/vendor.css';`,
    `.vendor {
  background: silver;
}.vendor-font {
  font-size: 14px;
}`
  );
});

test("04 - replaces @nested-import nested under :global", async () => {
  await run(
    `:global { @nested-import './test/mocks/vendor.css'; background: gold; }`,
    `:global { .vendor {
  background: silver;
} .vendor-font {
  font-size: 14px;
} background: gold; }`
  );
});

test("05 - empty import", async () => {
  await run(
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import ;
  }
}`,
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import ;
  }
}`
  );
});

test("06 - throws with a meaningful message when fs error happens", async () => {
  let error = await catchError(() =>
    run(
      `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import "nonexistent";
  }
}`
    )
  );
  match(error.message, /error reading file/);
  match(error.message, /nonexistent/);
});

test("07 - do not import @import", async () => {
  await run(
    `@import "./test/mocks/colors2.css";
    @media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import './test/mocks/colors1.css';
    @import "./test/mocks/colors2.css";
  }
}`,
    `@import "./test/mocks/colors2.css";
    @media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    h1 {
  color: red;
}
    @import "./test/mocks/colors2.css";
  }
}`
  );
});

test("08 - do import url() function", async () => {
  await run(
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import url('./test/mocks/colors1.css');
    @nested-import url("./test/mocks/colors2.css");
    @nested-import url(./test/mocks/colors1.css);
  }
}`,
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    h1 {
  color: red;
}
    h1 {
  color: blue;
}
    h1 {
  color: red;
}
  }
}`
  );
});

test("09 - url() function with line breaks", async () => {
  await run(
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import url(
      './test/mocks/colors1.css'
    );
    @nested-import url(
      "./test/mocks/colors2.css"
    );
    @nested-import url(
      ./test/mocks/colors1.css
    );
  }
}`,
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    h1 {
  color: red;
}
    h1 {
  color: blue;
}
    h1 {
  color: red;
}
  }
}`
  );
});

test("10 - package.json filter style, main & index", async () => {
  await run(
    `@nested-import './test/mocks/node_modules/style'; @nested-import './test/mocks/node_modules/main'; @nested-import './test/mocks/node_modules/index';`,
    `.style {} .main {} .index {}`
  );
});

test("11 - import based on current directory", async () => {
  await run(
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    @nested-import './mocks/colors1.css';
  }
}`,
    `@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    h1 {
  color: red;
}
  }
}`,
    undefined,
    path.join(__dirname, "app.css")
  );
});

test.run();
