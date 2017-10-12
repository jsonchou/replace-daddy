const loaderUtils = require('loader-utils');

function go(source, sub, resourcePath) {

    //通过载入外部配置文件方式replace
    if (sub.config && Object.keys(sub.config).length) {
        let { root = '', key = '', alias = '' } = sub; //make root + key unique to match loaded files
        let __daddy__ = sub.config[alias];

        __daddy__.forEach((item, index) => {
            let { search, replace, regexMode = 'ig' } = item;
            let rex = new RegExp(search, regexMode);
            for (let i in replace) {
                if (typeof replace[i] === 'boolean') {
                    //continue; //bool will do nothing
                }
                if (eval('sub.config.' + i)) {
                    if (key || root) {
                        if (resourcePath.indexOf(root) > -1 && resourcePath.indexOf(key) > -1) {
                            source = source.replace(rex, replace[i] + '')
                        }
                    } else {
                        source = source.replace(rex, replace[i] + '');
                    }
                }
            }
        })
        return source;
    } else {
        //通过webpack明文方式replace
        let { search, replace, regexMode = 'ig', root = '', key = '' } = sub

        if (typeof replace === 'boolean') {
            //return source; //bool will do nothing
        }

        let rex = new RegExp(search, regexMode);

        if (key || root) {
            if (resourcePath.indexOf(root) > -1 && resourcePath.indexOf(key) > -1) {
                source = source.replace(rex, replace + '')
            }
        } else {
            source = source.replace(rex, replace + '');
        }
        return source;
    }
}

module.exports = function(stream, map) {
    this.cacheable();

    let opt = loaderUtils.getOptions(this);

    let { multiple } = opt;

    let resPath = this.resourcePath;

    // console.log('resPath',resPath);

    if (!resPath) {
        //console.log('can not load your specified file');
        return;
    }

    multiple.forEach(function(sub) {
        sub && (stream = go(stream, sub, resPath))
    });

    this.callback(null, stream, map);
};