# 配置

```javascript
{
  context: string, // 根路径
  input: {
    src: string, // 源码路径
    script: string, // 程序入口
    html: string, // HTML 模板
  },
  output: {
    dll: string, // 预构建路径
    build: string, // 构建路径 
    public: string, // 服务路径
  },
  filenames: {
    prefix: string, // 输出子路径，尾部必须带斜杠
    dllPrefix: string, // Dll 输出子路径，尾部必须带斜杠，没有配置时使用 prefix
    js: string, // javaScript 文件命名
    css: string, // CSS 文件命名
    media: string, // 媒体文件命名
  },
  server: {
    host: string, // 服务器地址
    port: string, // 服务器端口
    proxy: string, // 请求转发地址
    original: object, // webpack dev serve config
  },
  chunks: [{
    name: string, // chunk 名称
    dependencies: string[], // chunk 依赖
  }],
  options: { // TODO advanced config
    'eslint-loader': object,
    'css-loader': object,
    'postcss-loader': object,
    'file-loader': object,
    'html-loader': object,
    'sass-loader': object,
    'style-loader': object,
    'url-loader': object,
  },
  webpack: {
    // original webpack config
  },
  listener: {
    afterBuild: function, // execute after build
  },
}
```

# 用法
- `ng dll --config [development.js]`
- `ng start --config [development.js]`
- `ng build --config [production.js]`
- `ng webpack --config [webpacj.config.js]`
