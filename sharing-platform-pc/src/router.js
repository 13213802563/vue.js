import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default new Router({
  mode: 'hash',
  // base: process.env.BASE_URL,
  //base: '/sharing-platform-pc',
  routes: [
    {
      path: '/',
      name: 'user-login',
      component: () => import('./views/user-login.vue')
    }, {
      path: '/index',
      name: 'index',
      component: () => import('./dashborad/index.vue'),
      redirect:'/index/servicer-manage-system',
      children: [
        {
          path: 'order-manage-system',
          name: 'order-manage-system',
          component: () => import('./views/order-manage-system.vue')
        },
        {
          path: 'servicer-manage-system',
          name: 'servicer-manage-system',
          component: () => import('./views/servicer-manage-system.vue')
        },{
          path: 'company-reg',
          name: 'company-reg',
          component: () => import('./views/company-reg.vue')
        },{
          path: 'import-servicer',
          name: 'import-servicer',
          component: () => import('./views/import-servicer.vue')
        },{
          path: 'import-order',
          name: 'import-order',
          component: () => import('./views/import-order.vue')
        },{
          path: 'import-idcard',
          name: 'import-idcard',
          component: () => import('./views/import-idcard.vue')
        },
        {
          path: 'finance-manage-system',
          name: 'finance-manage-system',
          component: () => import('./views/finance-manage-system.vue')
        }
      ]
    },
    ]
})
