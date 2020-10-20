# Vue Template with Nuxt ElementUI

## Install
在项目根目录下运行，安装依赖包。
```sh
npm install
```

## Development
启动开发模式，访问 http://localhost:3000
```sh
npm run dev
```

## Public
发布静态页面
```sh
npm run generate
```

生成dist目录，可以使用Nginx或其他Web服务器启动浏览

## Path

#### pages

>+ 每个 vue 文件对应一个入口页面
>+ name.vue 文件对应访问路径 /name

#### components
>+ 每个 vue 文件对应一个被页面加载的组件
>+ 可复用组件存放在 components 目录下，独立使用组件新建目录存放

#### assets

>+ 放置css、js文件
>+ import对应路径 '~/assets/'


## i18n

>+ 已内置i18n，使用参考 /pages/ab.vue
>+ 命名规则
>   - /pages/ab.vue 中 hello 内容对应  ('ab.hello')
>   - /components/overview.vue 中  select-zhCN 内容对应 ('componentsOverview.select-zhCN')
>   -默认添加zhCN即可，文件位置/assets/langs/zhCN.js
>   -elementui组件中使用的文字 el-date-picker 组件中 select 内容对应 ('elDatePicker.select')