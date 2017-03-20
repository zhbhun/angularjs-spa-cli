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
  server: {
    host: string, // 服务器地址
    port: string, // 服务器端口
  },
  chunks: [{
    name: string, // chunk 名称
    dependencies: string[], // chunk 依赖
  }],
  filenames: {
    js: string,
    css: string,
    media: string
  },
}
```

# 用法
- `ng dll --config [development.js]`
- `ng start --config [development.js]`
- `ng build --config [production.js]`
- `ng webpack --config [webpacj.config.js]`
