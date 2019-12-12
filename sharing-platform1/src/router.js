import Vue from 'vue'
import Router from 'vue-router'
let sd = new Router
sd.beforeEach()
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/login.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => import('./views/reg.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('./views/index.vue')
    },
    {
      path: '/index/orderManagerment',
      name: 'orderManagerment',
      component: () => import('./views/orderManagerment.vue')
    },{
      path: '/index/servicerManagerment',
      name: 'servicerManagerment',
      component: () => import('./views/servicerManagerment.vue'),

    },{
      path: '/index/customerManagerment',
      name: 'customerManagerment',
      component: () => import('./views/customerManagerment.vue')
    },{
      path: '/index/openSea',
      name: 'openSea',
      component: () => import('./views/openSea.vue')
    },{
        path: '/index/openSea/seaDetail',
        name: 'seaDetail',
        component: () => import('./views/seaDetails.vue')
    },
    {
      path: '/index/addUser',
      name: 'addUser',
      component: () => import('./views/user/addUser.vue')
    },
    {
      path: '/index/userDetails',
      name: 'userList',
      component: () => import('./views/user/userDetails.vue')
    },
    {
      path: '/index/editUser',
      name: 'userList',
      component: () => import('./views/user/editUser.vue')
    },
    {
      path: '/index/userList',
      name: 'userList',
      component: () => import('./views/user/userList.vue')
    },
    {
      path: '/index/orderManagerment/addOrder',
      name: 'addOrder',
      component: () => import('./views/addOrder.vue')
    },{
        path: '/index/orderManagerment/updateOrder',
        name: 'updateOrder',
        component: () => import('./views/updateOrder.vue')
    },{
        path: '/index/customerManagerment/customerDetail',
        name: 'customerDetail',
        component: () => import('./views/customerDetails.vue')
      },{
      path: '/index/customerManagerment/addCustomer',
      name: 'addCustomer',
      component: () => import('./views/addCustomer.vue')
    },{
        path: '/index/customerManagerment/updateCustomer',
        name: 'updateCustomer',
        component: () => import('./views/updateCustomer.vue')
      },{
      path: '/index/orderManagerment/orderDetails',
      name: 'orderDetails',
      component: () => import('./views/orderDetails.vue')
    },{
      path: '/index/servicerManagerment/addServicer',
      name: 'addServicer',
      component: () => import('./views/addServicer.vue')
    },{
      path: '/index/servicerManagerment/editServicer',
      name: 'editServicer',
      component: () => import('./views/editServicer.vue')
    },{
      path: '/index/servicerManagerment/servicerDetails',
      name: 'servicerDetails',
      component: () => import('./views/servicerDetails.vue')
    },{
      path: '/index/servicerManagerment/orderServicerDetails',
      name: 'orderServicerDetails',
      component: () => import('./views/orderServicerDetails.vue')
    },

    {
      path: '/areas',
      name: 'areas',
      component: () => import('./views/areas.vue')
    }, {
          path: '/index/seaServicer',
          name: 'seaServicer',
          component: () => import('./views/seaServicer.vue')
      },{
    path: '/index/seaServicer/seaServicerDetails',
      name: 'seaServicerDetails',
      component: () => import('./views/seaServicerDetails.vue')
    },{
    path: '/index/viewPool',
      name: 'viewPool',
      component: () => import('./views/viewPool.vue')
    },{
    path: '/index/poolDetails',
      name: 'poolDetails',
      component: () => import('./views/poolDetails.vue')
    },
    {
      path: '/information',
      name: 'information',
      component: () => import('./views/personal-center/information.vue')
    },
    {
      path: '/index/integralDetails',
      name: 'integralDetails',
      component: () => import('./views/personal-center/integralDetails.vue')
    }
    ,{
      path: '/index/per-center',
      name: 'per-center',
      component: () => import('./views/personal-center/per-center.vue')
    },
    {
      path:'/index/subCommission',
      name:'subCommission',
      component: () => import('./views/personal-center/subCommission.vue')
    },
    {
      path:'/index/per-center-mobile',
      name:'per-center-mobile',
      component: () => import('./views/personal-center/per-center-mobile.vue')
    },
    {
      path:'/index/subCommission',
      name:'subCommission',
      component: () => import('./views/personal-center/subCommission.vue')
    },
    {
      path:'/index/passWordForget',
      name:'passWordForget',
      component: () => import('./views/personal-center/passWordForget.vue')
    },
    {
      path:'/index/passWordEdit',
      name:'passWord',
      component: () => import('./views/personal-center/passWordEdit.vue')
    }
    ,{
      path: '/index/accountSecurity',
      name: 'accountSecurity',
      component: () => import('./views/personal-center/accountSecurity.vue')
    },
    {
      path: '/index/viewPublicOrders',
      name: 'viewPublicOrders',
      component: () => import('./views/viewPublicOrders.vue')
    },
    {
      path: '/index/viewPublicOrders/viewPublicOrdersDetails',
      name: 'viewPublicOrdersDetails',
      component: () => import('./views/viewPublicOrdersDetails.vue')
    },{
      path: '/index/viewPublicOrders/mergeOrderManagerment',
      name: 'mergeOrderManagerment',
      component: () => import('./views/mergeOrderManagerment.vue')
    },{
      path: '/index/orderManagerment/promotedServicePersonnel',
      name: 'promotedServicePersonnel',
      component: () => import('./views/promotedServicePersonnel.vue')
    },{
      path: '/index/promotedServiceOrders',
      name: 'promotedServiceOrders',
      component: () => import('./views/promotedServiceOrders.vue')
  },{
      path: '/index/queryAllServicePersonnel',
      name: 'queryAllServicePersonnel',
      component: () => import('./views/queryAllServicePersonnel.vue')
    },{
      path: '/index/pushOrderList',
      name: 'pushOrderList',
      component: () => import('./views/pushOrderList.vue')
    },{
      path: '/index/addPushOrder',
      name: 'addPushOrder',
      component: () => import('./views/addPushOrder.vue')
    },{
      path: '/index/addOrderList',
      name: 'addOrderList',
      component: () => import('./views/addOrderList.vue')
    },{
      path: '/index/addContract',
      name: 'addContract',
      component: () => import('./views/orderContract/addContract.vue')
    },
    {
      path: '/index/textVue',
      name: 'textVue',
      component: () => import('./views/orderContract/textVue.vue')
    },
    {
          path: '/index/completeContract',
          name: 'completeContract',
          component: () => import('./views/orderContract/completeContract.vue')
      },

      {
      path: '/index/viewContract',
      name: 'viewContract',
      component: () => import('./views/orderContract/viewContract.vue')
    },{
      path: '/index/m_receivables',
      name: 'm_receivables',
      component: () => import('./views/personal-center/m_receivables.vue')
    },{
          path: '/index/m_enterBusiness',
          name: 'm_enterBusiness',
          component: () => import('./views/personal-center/m_enterBusiness.vue')
      }, {
      path: '/index/m_cashWithdrawal',
      name: 'm_cashWithdrawal',
      component: () => import('./views/personal-center/m_cashWithdrawal.vue')
    },{
      path: '/index/subCommission/record',
      name: 'record',
      component: () => import('./views/personal-center/record.vue')
    },{
      path: '/index/realNameAuthentication',
      name: 'realNameAuthentication',
      component: () => import('./views/personal-center/realNameAuthentication.vue')
    }
    ,{
          path: '/index/addWriteSalary',
          name: 'addWriteSalary',
          component: () => import('./views/salary/addWriteSalary.vue')
      }
      ,{
      path: '/index/addAlreadySalary',
      name: 'addAlreadySalary',
      component: () => import('./views/salary/addAlreadySalary.vue')
    }
    ,{
      path: '/index/lookSalary',
      name: 'lookSalary',
      component: () => import('./views/salary/lookSalary.vue')
    }
    ,{
      path: '/index/payrollSms',
      name: 'payrollSms',
      component: () => import('./views/orderContract/payrollSms.vue')
    },{
      path: '/index/modifyWriteSalary',
      name: 'modifyWriteSalary',
      component: () => import('./views/orderContract/modifyWriteSalary.vue')
    }
  ]
})
