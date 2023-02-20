//引入依赖
const {createProxyMiddleware} = require("http-proxy-middleware");


module.exports = function (app) {
    app.use(
        createProxyMiddleware(
            '/api',
            {
                target: 'http://localhost:80',
                changeOrigin: true,
                pathRewrite: {
                    '/api': '/api'
                    // '/api': '/api'
                }
            }
        )
    );
};
