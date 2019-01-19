import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
//import Child from '@/components/child/Child'
import Parent from '@/components/child/Parent'

Vue.use(Router)

export default new Router({
  routes: [
//  {
//    path: '/',
//    name: 'HelloWorld',
//    component: HelloWorld
//  },
//  {
//    path: '/',
//    name: 'Child',
//    component: Child
//  },
    {
      path: '/',
      name: 'Parent',
      component: Parent
    }
  ]
})
