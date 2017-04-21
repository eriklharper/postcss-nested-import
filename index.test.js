var postcss = require('postcss');

var plugin = require('./');

function format(expected) {
    return expected.trim().replace(/[\s|;]/g, '');
}

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
    .then(result => {
        expect(format(result.css)).toEqual(format(output));
        expect(result.warnings().length).toBe(0);
    });
}

it(
  'replaces @import with the contents of the file being imported',
  () => run(
    '@import \'./vendor.css\';',
    '.vendor { background: silver } .vendor-font { font-size: 14px }'
  )
);

it(
  'replaces @import with the contents of the file being imported (globally)',
  () => run(
    ':global { @import \'./vendor.css\'; background: gold; }',
    `:global { .vendor { background: silver } .vendor-font { font-size: 14px }
    background: gold }`
  )
);
