const postcss = require('postcss');
const fs = require('fs');

/**
 * ParseImportPath
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function parseImportPath(path) {
    const matches = path.trim().match(/^['"](.+?)['"](.*)/);
    // const modes = matches[2].trim().split(' ');
    const fragment = matches[1];
    return fragment;
}

/**
 * ReadFile
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, contents) => {
            if (err) {
                return reject(err);
            }
            return resolve(contents);
        });
    });
}

/**
 * PostCSS Nested Import Plugin
 * @type {[type]}
 */
module.exports = postcss.plugin('postcss-nested-import', () => {
    return root => {
        return new Promise(resolve => {
            let prom = Promise.resolve();
            root.walkAtRules('import', importAtRule => {
                if (importAtRule.params) {
                    const path = parseImportPath(importAtRule.params);
                    if (path === null) {
                        return;
                    }
                    prom = prom.then(() => readFile(path).then(fileContents =>
                      importAtRule.replaceWith(fileContents)
                    ));
                }
            });
            resolve(prom);
        });
    };
});
