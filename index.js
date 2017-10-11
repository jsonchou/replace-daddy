const _ = require('lodash');
const loaderUtils = require('loader-utils');

function go(source, options) {
    if (options.search && options.replace) {
        options.search = new RegExp(options.search, options.flags || 'ig');
        source = source.replace(options.search, options.replace);
        return thunk;
    }
    return source;
}

module.exports = function(stream, map) {
    this.cacheable();

    let opt = loaderUtils.getOptions(this);

    opt.multiple.forEach(function(sub) {
        stream = go(stream, sub);
    });

    this.callback(null, stream, map);
};