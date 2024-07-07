const mix = require('laravel-mix');
const ESLintPlugin = require('eslint-webpack-plugin');

mix.disableNotifications();

mix.webpackConfig({
    devtool: mix.inProduction() ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.less$/,
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true,
                    }
                }
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'jsx'],
            exclude: ['node_modules']
        })
    ]
});

mix.js('resources/js/client/admin/roots/app.js', 'public/js/client/admin/roots')
    .js('resources/js/client/frontend/roots/projects.js', 'public/js/client/frontend/roots')
    .js('resources/js/client/frontend/roots/error.js', 'public/js/client/frontend/roots')
    .react();

if (mix.inProduction()) {
    mix.version();
}
