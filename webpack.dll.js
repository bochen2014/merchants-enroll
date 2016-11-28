const path = require('path');
const webpack = require('webpack');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const vendors = [
    'react',
    'react-dom',
    'react-router',
    'react-redux',
    'redux',
    'babel-polyfill'
];

module.exports = {
    entry: {
        vendor: vendors
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dist', '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }
        })
    ]
};


/*
webpack.DllPlugin v.s. CommonChunkPlugin
entry:{
    app:'index.js'          ==> chunk#1: app.js
    vendor:['libA','libB']  ==> chunk#2: vendor.js
} 
this will by default generate 2 files, app.js and vendor.js
**However**, app.js contains libA and libB (should both libA and libB are referenced by index.js)
to split libA and libB out of app.js,you would need CommonChunkPlugin



new CommonsChunkPlugin({
  name: "commons",
  // (the commons chunk name)

  filename: "commons.js",
  // (the filename of the commons chunk)


  // minChunks: 3, => we only have 2 chunks, here by specifying at least 3 chunks sharing the same module, 
                      we move no modules into common.js; if we specify infinity here, webpack will skip
                      creating common.js becuase it knows we don't want to create a commonChunk file
                      (used when creating vendor.js in backoffice-frontend)
  // (Modules must be shared between 3 entries, i.e. must be shard by 3 chunks)

  // chunks: ["app", "vendor"],
  // (Only use these entries)
})

if a module ( a module is normall a js file with an export) is used/shared by at least 3 chunks
 */