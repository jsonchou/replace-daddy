# Replace loader for [Webpack](http://webpack.github.io/)

Replace Everything you want...

## Install:

```bash
$ npm i -D replace-daddy
```

## Usage:

```javascript
module.exports = {
  // ...
  module: {
    loaders: [
      {
        test: /\.js[x]$/,
        loader: 'replace-daddy',
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