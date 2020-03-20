const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const path = require('path');

module.exports = withCss(withLess({
	exportPathMap: async function (defaultPathMap) {
		return {
			'/': {page: '/'}
		}
	},
	webpack(config, {}) {
		const originalEntry = config.entry;
		config.entry = async () => {
			const entries = await originalEntry();
			if (
				entries['main.js'] &&
				!entries['main.js'].includes('./client/polyfill.js')
			) {
				entries['main.js'].unshift('./client/polyfill.js')
			}
			return entries
		};
		config.node = {
			fs: 'empty'
		};
		config.resolve.alias = {
			...config.resolve.alias,
			'config': path.resolve(__dirname, './config'),
			'server': path.resolve(__dirname, './server/index.js'),
			'components': path.resolve(__dirname, './components'),
			'static': path.resolve(__dirname, './static'),
			'store': path.resolve(__dirname, './store'),
		};
		config.module.rules.push({
			test: /\.(png|jpe?g|svg|gif)$/,
			use: [{
				loader: 'file-loader',
				options: {
					limit: 1000,
					name: 'images/[name].[ext]'
				}
			}],
		}, {
			test: /\.(eot|svg|ttf|woff)$/,
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 1000
					}
				}
			]
		});
		return config
	},
	lessLoaderOptions: {
		javascriptEnabled: true,
		importLoaders: 1,
		localIdentName: '[local]___[hash:base64:5]',
	}
}));
