const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 代理 TensorFlow.js 模型请求
app.use('/tfjs-models', createProxyMiddleware({
  target: 'https://storage.googleapis.com/tfjs-models',
  changeOrigin: true,
  pathRewrite: {
    '^/tfjs-models': '',
  },
}));

// 如果你的 React 应用的构建版本在 'build' 文件夹中
app.use(express.static('build'));

// 其他路由和中间件
// ...

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
