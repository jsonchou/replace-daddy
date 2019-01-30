const loaderUtils = require('loader-utils');

function go(source, sub, resourcePath) {

    if (sub.file) {
        sub.config = require(sub.file);
    }

    //const way to replace
    if (sub.config && Object.keys(sub.config).length) {
        let {
            root = '', key = '', alias = '__daddy__'
        } = sub; //make root + key unique to match loaded files
        let __daddy__ = sub.config[alias];

        if (!__daddy__) {
            throw new Error('you have no alias [__daddy__] in your const module files');
            return;
        }

        __daddy__.forEach((item, index) => {
            let {
                search,
                replace,
                regexMode = 'ig'
            } = item;
            let rex = new RegExp(search, regexMode);
            if (typeof replace === 'object') {
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
            } else if (typeof replace === 'string') {
                let param = eval('sub.config.' + replace)
                source = source.replace(rex, param);
            }
        })
        return source;
    } else {
        //default way to replace
        let {
            search,
            replace,
            regexMode = 'ig',
            root = '',
            key = ''
        } = sub

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

module.exports = function (stream, map) {
    this.cacheable();
    let opt = loaderUtils.getOptions(this);
    let {
        multiple
    } = opt;
    let resPath = this.resourcePath;
    // console.log('resPath',resPath);
    if (!resPath) {
        //console.log('can not load your specified file');
        return;
    }
    multiple.forEach(function (sub) {
        sub && (stream = go(stream, sub, resPath))
    });

    this.callback(null, stream, map);
};