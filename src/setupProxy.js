//引入依赖
const {createProxyMiddleware} = require("http-proxy-middleware");


module.exports = function (app) {
    app.use(
        createProxyMiddleware(
            '/api',
            {
                target: 'http://1.14.94.72',
                changeOrigin: true,
                pathRewrite: {
                    '/api': '/api'
                    // '/api': '/api'
                }
            }
        )
    );
};
