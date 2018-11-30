/* eslint-disable no-undef */

const path = require("path");

const alias = {
  jquery: path.resolve("./node_modules/jquery"),
  "lodash-es": path.resolve("./node_modules/lodash-es"),
  fonts: path.resolve("./src")
};

module.exports = {
  slateCssVarLoader: {
    cssVarLoaderLiquidPath: ["src/snippets/css-variables.liquid"]
  },
  slateTools: {
    extends: {
      dev: {
        resolve: { alias },
        module: {
          rules: [
            {
              test: require.resolve("flexslider"),
              use: "imports-loader?$=jquery,jQuery=jquery"
            },
            {
              test: require.resolve("slick-carousel"),
              use: "imports-loader?$=jquery,jQuery=jquery"
            }
          ]
        }
      },
      prod: {
        resolve: { alias },
        module: {
          rules: [
            {
              test: require.resolve("flexslider"),
              use: "imports-loader?$=jquery,jQuery=jquery"
            },
            {
              test: require.resolve("slick-carousel"),
              use: "imports-loader?$=jquery,jQuery=jquery"
            }
          ]
        }
      }
    }
  }
};
