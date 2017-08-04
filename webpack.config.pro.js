const HtmlWebpackPlugin = require("html-webpack-plugin"); //模版生成文件
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var HappyPack = require('happypack');


const PATHS = {
	app: path.join(__dirname,"app"),
	dist: path.join(__dirname,"dist")
}

const plugin = new ExtractTextPlugin({
	filename: 'css/[name].optimize.css',
	ignoreOrder: true
})

module.exports = {
    devServer: {
        host: process.env.HOST, // Defaults to `localhost`
        port: 80, // Defaults to 8080
        overlay: {
            errors: true,
            warnings: true,
        },
    }, //网页显示错误 端口设置
	entry: {
		app: PATHS.app+"/js",
	},
	output :{
		path: PATHS.dist,
		filename: "js/[name].js"
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "webpack demo",
			tmplete: "app/view/templete.html"
		}),
        plugin,
        new BabiliPlugin(), //js压缩
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        }), //css压缩
        new HappyPack({
            loaders: [ 'babel-loader?presets[]=es2015' ],
        })
	],
	module:{
		rules:[
			{
                test: /\.js$/,
                loader:'happypack/loader',
                 include: path.join(__dirname, "/app/js"),
                 exclude: path.join(__dirname, "/node_modules"), //加快编译速度
			},
			{
				test:/\.css$/,
                include: path.join(__dirname, "/app/css"),
                exclude: path.join(__dirname, "/node_modules"), //加快编译速度
				use: plugin.extract({
                    fallback: "style-loader", //在这里指定styleLoader 不要在use中
                    use: [{
                        loader: 'css-loader',
                        query:{
                            importLoaders : 1,
                            moudle:true
                        }
                    },'postcss-loader'],
				})
			},
            {
                test: /\.less$/,
                include: path.join(__dirname, "/app/css"),
                exclude: path.join(__dirname, "/node_modules"), //加快编译速度
                use: plugin.extract({
                    fallback: "style-loader", //在这里指定styleLoader 不要在use中
                    use: [{
                        loader: "css-loader" // translates CSS into CommonJS
                    }, 'postcss-loader',{
                        loader: "less-loader" // compiles Less to CSS
                    }]
                })
            },
            {
                test:/\.(png|jpg|jpeg|gif|svg)$/,
                include: path.join(__dirname, "/app/img"),
                exclude: path.join(__dirname, "/node_modules"), //加快编译速度
                use: 'url-loader?limit=8192&name=../images/[name].[ext]?[hash]'
            }
		]
	},
}