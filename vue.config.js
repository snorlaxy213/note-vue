/* eslint-env node */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    lintOnSave: false,

    devServer: {
        port: 9003, // 修改为9003以匹配错误信息中的端口
        proxy: {
            '/api': {
                target: 'http://localhost:9000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    // 生产环境优化配置
    configureWebpack: config => {
        // 生产环境启用bundle分析（可选）
        if (process.env.NODE_ENV === 'production' && process.env.ANALYZE) {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                    reportFilename: 'bundle-report.html'
                })
            );
        }

        // 代码分割优化
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // 第三方库分离
                    vendor: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial'
                    },
                    // Element UI 单独分离
                    elementUI: {
                        name: 'chunk-element-ui',
                        test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                        priority: 20,
                        chunks: 'all'
                    },
                    // Mavon Editor 单独分离
                    mavonEditor: {
                        name: 'chunk-mavon-editor',
                        test: /[\\/]node_modules[\\/]mavon-editor[\\/]/,
                        priority: 20,
                        chunks: 'all'
                    },
                    // 公共组件分离
                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        priority: 5,
                        chunks: 'all',
                        enforce: true
                    }
                }
            },
            // 运行时代码分离
            runtimeChunk: {
                name: 'runtime'
            }
        };
    },

    // 链式配置
    chainWebpack: config => {
        // 暂时注释掉预加载配置以解决启动问题
        // config.plugin('preload').tap(options => {
        //     options[0] = {
        //         rel: 'preload',
        //         include: 'initial',
        //         fileBlacklist: [/\.map$/, /hot-update\.js$/]
        //     };
        //     return options;
        // });
        
        // config.plugin('prefetch').tap(options => {
        //     options[0].fileBlacklist = options[0].fileBlacklist || [];
        //     options[0].fileBlacklist.push(/chunk-vendors\..*\.js$/);
        //     return options;
        // });
        
        // 生产环境优化
        if (process.env.NODE_ENV === 'production') {
            // 移除console
            config.optimization.minimizer('terser').tap(args => {
                args[0].terserOptions.compress.drop_console = true;
                args[0].terserOptions.compress.drop_debugger = true;
                return args;
            });
        }
    }
};

