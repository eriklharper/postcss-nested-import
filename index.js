const path = require("path");
const { readFileSync } = require("fs");
const resolve = require("resolve");

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    AtRule: {
      "nested-import": (node, { result }) => {
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

        let basedir = process.cwd();
        if (node.source && node.source.input && node.source.input.file) {
          basedir = path.dirname(node.source.input.file);
        }

        try {
          let resolvedPath = resolve.sync(id, {
            basedir,
            extensions: [".css"],
            moduleDirectory: ["web_modules", "node_modules"],
            packageFilter: (pkg) => {
              if (pkg.style) pkg.main = pkg.style;
              else if (!pkg.main || !/\.css$/.test(pkg.main))
                pkg.main = "index.css";
              return pkg;
            }
          });

          replacement = readFileSync(resolvedPath, "utf8");
          result.messages.push({
            file: resolvedPath,
            parent: result.opts.from,
            plugin: "postcss-nested-import",
            type: "dependency"
          });
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
