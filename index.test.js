var postcss = require('postcss');

var plugin = require('./');

function run(input, output, opts) {
  return postcss([ plugin(opts) ]).process(input)
    .then(result => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
  });
}


it('replaces @import with the contents of the file being imported inside a declaration block.', () => {
  return run("@import './vendor.css';",
             '.vendor { background: silver; } .vendor-font { font-size: 14px; }');
});

it('replaces @import with the contents of the file being imported inside a declaration block.', () => {
  return run(":global { @import './vendor.css'; background: gold; }",
             ':global { .vendor { background: silver; } .vendor-font { font-size: 14px; } background: gold; }');
});

it('replaces @import with the contents of the file being imported from a root-relative path.', () => {
  return run('@import "vendor/vendor.css";',
             '.vendor { background: silver; }');
});

it('replaces @import with the contents of the file being imported from a root-relative path inside a declaration block.', () => {
  return run(":global { @import 'vendor/vendor.css'; }",
             ':global { .vendor { background: silver; } }');
});
