var VERSION = require('../package.json').version;
var targetName = 'event_stream-' + VERSION + '.js';
var path = require('path');

module.exports = {
  entry: './lib/event_stream',
  output: {
    library: 'EventStream',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist'),
    filename: targetName
  }
};
