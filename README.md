# 配置

```javascript
{
  context: string, // 根路径
  // 输入，支持多入口
  input: {
    name: string, // 入口名称，默认 main
    src: string, // 源码路径
    script: string, // 程序入口
    html: string, // HTML 模板
  },
  // 输出
  output: {
    dll: string, // 预构建路径
    build: string, // 构建路径 
    public: string, // 服务路径
  },
  filenames: {
    js: string, // javaScript 文件命名
    css: string, // CSS 文件命名
    media: string, // 媒体文件命名
  },
  server: {
    host: string, // 服务器地址
    port: string, // 服务器端口
    original: object, // webpack dev serve config
  },
  proxy: object, // 代理，参考 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
   // false: 禁用
   // undefined / string: 默认使用 package.json 的 dependencies，如果不是字符串则 chunk 名为 dev
   // array: 自定义
  chunks: [{
    name: string, // chunk 名称
    dependencies: string[], // chunk 依赖
  }],
  // TODO advanced config
  options: {
    'eslint-loader': object,
    'css-loader': object,
    'postcss-loader': object,
    'file-loader': object,
    'html-loader': object,
    'sass-loader': object,
    'style-loader': object,
    'url-loader': object,
  },
  // original webpack config
  webpack: object,
  // build listener
  listener: {
    afterBuild: function, // execute after build
  },
}
```

# 用法
- `ng dll --config [development.js]`
- `ng start --config [development.js]`
- `ng build --config [production.js]`
- `ng watch --config [development.js]`
- `ng webpack --config [webpacj.config.js]`
