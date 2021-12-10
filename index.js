const { readFileSync } = require("fs");
const path = require("path");

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    AtRule(node) {
      if (node.name === "import") {
        if (
          !node.params ||
          typeof node.params !== "string" ||
          node.params.length < 3
        ) {
          return;
        }

        let resolvedPath = path.resolve(
          node.params.slice(
            `'"`.includes(node.params[0]) ? 1 : 0,
            `'"`.includes(node.params[~-node.params.length]) ? -1 : undefined
          )
        );
        let replacement;
        try {
          replacement = readFileSync(resolvedPath, "utf8");
        } catch (error) {
          throw node.error(`error reading file:\n${resolvedPath}`);
        }
        node.replaceWith(`${node.raws.before}${replacement}`);
      }
    },
    postcssPlugin: "ppostcss-nested-import"
  };
};

module.exports.postcss = true;
