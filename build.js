#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const rollup = require('rollup');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCommonJs = require('rollup-plugin-commonjs');
const rollupPluginJson = require('rollup-plugin-json');

const _requestRollup = p => rollup.rollup({
  entry: p,
  plugins: [
    rollupPluginNodeResolve({
      main: true,
      preferBuiltins: false,
    }),
    rollupPluginCommonJs(),
    rollupPluginJson(),
  ],
})
  .then(bundle => {
    const result = bundle.generate({
      moduleName: module,
      format: 'cjs',
      useStrict: false,
    });
    const {code} = result;
    const wrappedCode = '(function() {\n' + code + '\n})();\n';
    return wrappedCode;
  });

_requestRollup(path.join(__dirname, 'app', 'ui.js'))
  .then(d => {
    fs.writeFile(path.join(__dirname, 'index.js'), d, err => {
      if (err) {
        console.warn(err);

        process.exit(1);
      }
    });
  })
  .catch(err => {
    console.warn(err);

    process.exit(1);
  });
