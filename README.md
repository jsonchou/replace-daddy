# Replace loader for [Webpack](http://webpack.github.io/)

Replace Everything you want...

## Install:

```bash
$ npm i -D replace-dady
```

## Usage:

```javascript
module.exports = {
  // ...
  module: {
    loaders: [
      {
        test: /\.js[x]$/,
        loader: 'replace-dady',
        query: {
          multiple: [
             { search: '__codeSplitType__', replace: 'whatever' },
          ]
        }
      }
    ]
  }
}
```