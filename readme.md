

## 构建过程

创建脚手架(express, ejs)：

    npx express-generator --view=ejs --git

创建 src 目录，把 app.js 移到该目录下，并改名为：

    app.ts

同时把 bin/www 的启动文件从 ../app.js 改成

    ../dist/app.js

安装 Typescript 需要的库：

    npm i -D typescript
    npm i -D tsc-watch
    npm i -D @types/node
    npm i -D @types/express


