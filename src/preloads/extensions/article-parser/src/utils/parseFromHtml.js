// utils -> parseFromHtml

const {
  unique,
} = require('bellajs');

const sanitize = require('sanitize-html');

const extractMetaData = require('./extractMetaData');
const chooseBestUrl = require('./chooseBestUrl');
const normalizeUrl = require('./normalizeUrl');
const isValidUrl = require('./isValidUrl');
const standalizeArticle = require('./standalizeArticle');
const extractWithReadability = require('./extractWithReadability');


const {
  info,
} = require('./logger');


const cleanify = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false,
  });
};

module.exports = async (input, links) => {
  info('Start parsing from HTML...');
  const html = cleanify(input);
  const meta = extractMetaData(html);

  const {
    title = '',
  } = meta;


  [
    'url',
    'shortlink',
    'amphtml',
    'canonical',
  ].forEach((p) => {
    if (meta[p]) {
      links.push(meta[p]);
    }
  });

  info('Extracting main article...');
  const mainText = await extractWithReadability(html);

  info('Finding the best link...');
  const ulinks = unique(links.filter(isValidUrl).map(normalizeUrl));
  const bestUrl = chooseBestUrl(ulinks, title);

  info('Normalizing content');

  let normalizedContent = standalizeArticle(mainText, bestUrl);
  
  info('Finish parsing process');
  return {
    content: normalizedContent,
  };
};
