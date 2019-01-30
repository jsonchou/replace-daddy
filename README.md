# Replace loader for [Webpack](http://webpack.github.io/)

Replace everything in all plain text file...

## Install:

```bash
$ npm i -D replace-daddy
```

## Usage:

### Hardcode

```javascript

# project
const assetsPath = '__debug__'==='true' ? `http://__localIP__:__localPORT__/foo` : `//cdn.site.com/assets/bar`;
import routes from './router/__routerMode__'
/* webpackChunkName: "__spaDirBuild__/Index" */

# webpack
module.exports = {
  // ...
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx|vue)$/,
        loader: 'replace-daddy',
        query: {
          multiple: [
            { search: '__debug__', replace: myConfig.debug || true,  }, //warning: use bool string in condition syntax 
            { search: '__localIP__', replace: getIPAddress(),  },
            { search: '__localPORT__', replace: getHostPORT(), },
            { search: '__imagesDir__', replace: 'images/bar/foo', },
            { search: '__spaDirBuild__', replace:'assets/scripts'},
            { search: '__routerMode__', replace: 'router-split', regexMode:'ig' },
          ]
        }
      }
    ]
  }
}
```

### Dynamic by local config file

```javascript

# project
import routes from './router/__routerMode__'
import boot from './config/__bootPath__'

# webpack
module.exports = {
  // ...
  module: {
    loaders: [
      {
         test: /\.(js|jsx|vue)$/,
        loader: 'replace-daddy',
        query: {
          multiple: [
             { file: path.join(__dirname, '..', 'api/config.js'), alias: '__daddy__' },
          ]
        }
      }
    ]
  }
}

### CONSTS.js  like 

module.exports = {
    debug: 'dev',//there can be bool, number whatever
    prefix:'ax',
    router: {
        split: true, 
        mode: 'hash', 
    },
    __daddy__: [
        { search: '__prefix__', replace:'prefix', regexMode: 'ig' },
        { search: '__debug__', replace:'debug', regexMode: 'ig' },
        { search: "__routerMode__", replace: { "router.split==true": "router-split", "router.split==false": "router-common" }, regexMode: "ig" },
        { search: "__bootPath__", replace: { "debug=='dev'": "config.dev.js", "debug=='pro'": "config.pro.js" } },
    ]
}

```

### Advanced

#### tips
- lot of spa(vue,react,ng) projects(pro1,pro2,pro3) in a single webpack environment, you may need **root** and **key** to make your files unique to been replaced

```javascript

# project
import routes from './router/__routerMode__'
import boot from './router/__bootPath__'

# webpack
module.exports = {
    //...
    module: {
      loaders: [{
        test: /\.(js|jsx|vue)$/,
        loader: 'replace-daddy',
        query: {
            multiple: [
                { search: '__routerMode__', replace: 'whatever', regexMode: 'ig' },
                { root: 'vue', name: 'spafoldername', file: 'api/CONSTS.js', alias: '__daddy__'},
            ]
          }
      }
    ]}
}

```

## Why this loader been created

### fake & error code
``` javascript
if (config.router.split) {
    import routes from './router/router-split' //code spliting by router
} else {
    import routes from './router/router-common'
}
// you know why
```