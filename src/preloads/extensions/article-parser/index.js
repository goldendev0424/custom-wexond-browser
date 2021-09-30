/**
 * Starting app
 * @ndaidong
**/

// module.exports = {
//   main: 'main'
// }
const main = require('./src/main.js');
main.version = require('./package.json').version;

module.exports = main;
