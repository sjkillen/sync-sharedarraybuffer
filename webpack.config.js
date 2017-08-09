"use strict";

const path = require('path'),
   webpack = require("webpack"),
   pack = require("./package");

module.exports = {
   entry: './src/main.ts',
   resolve: {
      extensions: [".ts", ".js"]
   },
   output: {
      library: "Cephalopod",
      libraryTarget: "umd",
      filename: `lib.js`,
      path: path.resolve(__dirname, `dist`)
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: ["ts-loader"]
         },
      ]
   }
};