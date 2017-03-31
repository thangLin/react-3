var webpack = require('webpack');
// var providePlugin = new webpack.providePlugin();
var path = require('path');
module.exports = {
    entry:"./src/js/index.js",
    output:{
        path: path.join( __dirname, './out/'),
        // publicPath:"https://localhost:8080/out/",
        publicPath:'./out/',
        filename:"index.js"
    },
    module:{
        rules:[
           {test:/\.less$/,use:["style-loader","css-loader","less-loader"] },
           {
              test: /\.js$/,
              loader:"babel-loader",
              exclude:/node_modules/,
              query:{
                presets: [
                    require.resolve("babel-preset-es2015"),
                    require.resolve("babel-preset-react"),
                    require.resolve("babel-preset-stage-0")
                ]
              }
           },
           {test:/\.(jpg|png)$/,loader:"url-loader"}
        ]
    },
    devServer:{
        port:8080,
        historyApiFallback:true,
        inline:true
    },
    // plugins:[
    //     providePlugin,
    //     new webpack.NoEmitOnErrorsPlugin()
    // ]

}