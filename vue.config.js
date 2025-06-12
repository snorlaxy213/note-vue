/* eslint-env node */
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
    }
};

