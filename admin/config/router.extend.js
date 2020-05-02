export default [
  {
    name: '管理员管理',
    icon: 'idcard',
    path: '/manage/admin',
    component: './Admin/admin',
    authority: 'admin',
  },
  { name: '学生管理', icon: 'user', path: '/manage/student', component: './Student/student' },
  { name: '商品管理', icon: 'notification', path: '/manage/good', component: './Good/good' },
];
