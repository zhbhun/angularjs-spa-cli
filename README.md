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
    js: string, // javaScript 文件命名
    css: string, // CSS 文件命名
    media: string, // 媒体文件命名
  },
  server: {
    host: string, // 服务器地址
    port: string, // 服务器端口
    proxy: string, // 请求转发地址
    nproxy: string, // 代理规则配置路径，参考 [nproxy](https://github.com/goddyZhao/nproxy)
    original: object, // webpack dev serve config
  },
  chunks: [{
    name: string, // chunk 名称
    dependencies: string[], // chunk 依赖
  }],
}
```

# 用法
- `ng dll --config [development.js]`
- `ng start --config [development.js]`
- `ng build --config [production.js]`
- `ng webpack --config [webpacj.config.js]`
