let routerArr = require('./routerNames')
let routerFunc = app => {
  routerArr.forEach(routerName => {
    app.router.resources(`/api/${routerName}`, app.controller[routerName]);
  })
};
module.exports = {
  routerFunc
}
