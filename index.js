const { readFileSync } = require("fs");
const resolve = require("resolve");

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    AtRule: {
      "nested-import": (node) => {
        if (
          !node.params ||
          typeof node.params !== "string" ||
          node.params.length < 3
        ) {
          return;
        }

        let id = node.params
          .replace(/^(url\(\s*)?['"]?/, "")
          .replace(/['"]?\s*(\))?$/, "");

        let replacement;
        try {
          let resolvedPath = resolve.sync(id, {
            basedir: process.cwd(),
            moduleDirectory: ["web_modules", "node_modules"],
            extensions: [".css"],
            packageFilter: (pkg) => {
              if (pkg.style) pkg.main = pkg.style;
              else if (!pkg.main || !/\.css$/.test(pkg.main))
                pkg.main = "index.css";
              return pkg;
            }
          });

          replacement = readFileSync(resolvedPath, "utf8");
        } catch (error) {
          throw node.error(`error reading file:\n${id}`);
        }
        node.replaceWith(`${node.raws.before}${replacement}`);
      }
    },
    postcssPlugin: "postcss-nested-import"
  };
};

module.exports.postcss = true;
