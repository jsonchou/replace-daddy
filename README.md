# Replace loader for [Webpack](http://webpack.github.io/)

Replace everything in all text file type...

## Install:

```bash
$ npm i -D replace-daddy
```

## Usage:

### Hardcode

```javascript

# project
const routes = [
    {
        path: '/',
        exact: true,
        component: (props) => getComponent(props, () => import(
            /* webpackChunkName: "__spaDir__/assets/scripts/Index" */
            /* webpackMode: "lazy" */
            '../containers/Index'))
    },
];

const assetsPath = '__debug__'==='true' ? `http://__localIP__:__localPORT__/foo` : `//cdn.site.com/assets/bar`;

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
            { search: '__debug__', replace: myConfig.debug || true,  } //warning: use bool string in condition syntax 
            { search: '__localIP__', replace: getIPAddress(),  }
            { search: '__localPORT__', replace: getHostPORT(), }
            { search: '__imagesDir__', replace: 'images/bar/foo', }
            { search: '__scriptsDir__', replace: 'scripts/bar/foo', }
          ]
        }
      }
    ]
  }
}
```

### Dynamic by local file

```javascript

# project
import routes from './router/__routerMode__'
import boot from './router/__bootPath__'

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
             { search: '__routerMode__', replace: 'whatever', regexMode:'ig' },
             { file: 'api/CONSTS.js'), alias: '__daddy__' },
          ]
        }
      }
    ]
  }
}

### CONSTS.js  like 

module.exports = {
    debug: 'dev',//there can be bool, number whatever
    router: {
        split: true, 
        mode: 'hash', 
    },
    prefix: `za_${spaDir}_`,
    __daddy__: [
        { search: "__routerMode__", replace: { "router.split==true": "router-split", "router.split==false": "router-common" }, regexMode: "ig" },
        { search: "__bootPath__", replace: { "debug=='dev'": "config.dev.js", "debug=='pro'": "config.pro.js" } },
    ]
}

```

### Advanced

#### tips
- lot of spa(vue,react,ng) projects(pro1,pro2,pro3) in a single webpack environment, you may need **root** and **key** to make your files unique to replace

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
                { root: 'vue', name: 'some folder name' file: 'api/CONSTS.js'), alias: '__daddy__'},
            ]
          }
      }
    ]}
}

```