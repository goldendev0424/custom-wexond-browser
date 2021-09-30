/**
 * Article parser
 * @ndaidong
 **/

const {
  isString
} = require('bellajs');

const parseFromHtml = require('./utils/parseFromHtml');

const {
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
} = require('./config');

const extract = async (input) => {
  if (!isString(input)) {
    throw new Error('Input must be a string');
  }

  return await parseFromHtml(input, []);
};

module.exports = {
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
  extract,
};
