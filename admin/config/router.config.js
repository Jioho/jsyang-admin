import extendAdminRouterArr from './router.extend.js';
export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/manage/admin' },
      ...extendAdminRouterArr,
      {
        name: 'code-produce',
        icon: 'user',
        path: '/code/produce',
        component: './Code/form',
        authority: 'admin',
      },
      // {
      //   name: '修改密码',
      //   icon: 'user',
      //   path: '/changepasswd',
      //   component: './Changepasswd',
      //   authority: 'admin',
      // },
      {
        component: '404',
      },
    ],
  },
];
