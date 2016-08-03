var VERSION = require('../package.json').version;
var targetName = 'event_bus-' + VERSION + '.js';
var path = require('path');

module.exports = {
  entry: './lib/event_bus',
  output: {
    library: 'EventBus',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist'),
    filename: targetName
  },
  externals: [
    { './event_stream': 'var EventStream' }
  ]
};
