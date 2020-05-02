module.exports = {
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: `./favicon.ico` }],
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }],
    [
      'script',
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js' }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css'
      }
    ]
  ],
  title: 'JsyangAdmin',
  description: '一个基于JavaScript的中台快速生成解决方案',
  themeConfig: {
    // sidebar: 'auto',
    logo: '/logo.png',
    displayAllHeaders: true,
    sidebar: [ '/info', '/env', '/dev', 'learn', '/advance','/build', '/together', '/me'],
    nav: [
      {text: '首页',link: '/'},
      {
        text: '项目使用依赖相关文档',
        items: [
          { text: 'nodejs', link: 'https://nodejs.org/zh-cn/docs/' },
          { text: 'egg', link: 'https://eggjs.org/zh-cn/' },
          { text: 'squelize', link: 'https://sequelize.org/' },
          { text: 'squelize中文', link: 'https://itbilu.com/nodejs/npm/V1PExztfb.html' },
          { text: 'mysql教程', link: 'https://www.runoob.com/mysql/mysql-tutorial.html' },
          { text: 'react', link: 'https://zh-hans.reactjs.org/' },
          { text: 'antd-design', link: 'https://ant.design/docs/react/introduce-cn' },
          { text: 'dva', link: 'https://dvajs.com' },
          { text: 'umi', link: 'https://umijs.org/zh-CN/' }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/jsyang666/jsyang-admin' }
    ]
  }
};
