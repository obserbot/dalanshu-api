

## 构建过程

1. [创建脚手架](#创建脚手架)

实现基本的脚手架代码，配置好这些框架：express, ejs, typescript

### 创建脚手架

创建脚手架(express, ejs)：

    npx express-generator --view=ejs --git

创建 src 目录，把 app.js, routes/ 移到该目录下，并改名为：

    app.ts

同时把 bin/www 的启动文件从 ../app.js 改成

    ../dist/app.js

安装 Typescript 需要的库：

    npm i -D typescript
    npm i -D tsc-watch
    npm i -D @types/node
    npm i -D @types/express

配置 ts：

    npx tsc --init --moduleResolution node --resolveJsonModule --target es6 --noImplicitAny --sourceMap --lib dom,es2017 --outDir dist

创建 dist 目录，并把 views 目录移到 dist 目录下。

编译：

    npx tsc

运行：

    npm run start



