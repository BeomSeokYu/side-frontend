import { createRouter, createWebHistory } from 'vue-router'
import CommonUtils from '@/utils/common'
import store from "@/store";

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FullLayout from '@/layouts/FullLayout.vue'
import Home from '@/pages/Home.vue'

const routeList = {
  value: [],
};

// 페이지 디렉토리의 모든 .vue 파일을 자동으로 가져옴
const requireComponent = require.context(
  '../pages',     // 구성 요소 폴더의 상대 경로
  true,           // 하위 폴더를 볼지 여부
  /\.vue$/        // 기본 구성 요소 파일 이름을 일치시키는 데 사용되는 정규식
);
requireComponent.keys().forEach(fileName => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase name of the component
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');

  const componentPath = fileName.substring(fileName.indexOf('.') + 1, fileName.lastIndexOf('.'))

  // Add the route to the routes array
  routeList.value.push({
    path: componentPath.toLowerCase(),
    name: componentName,
    component: componentConfig.default || componentConfig,
  });
});

// layoutType으로 Layout 구분을 위해 DB에서 가져온 리스트와 결합
const routeMenuList = store.state.common.routeMenuList;
if (routeMenuList || routeMenuList?.length > 0) {
  routeList.value = CommonUtils.mergeObjectArrays(routeList.value, routeMenuList, 'path')
}

// router 경로 및 해당 컴포넌트 설정
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '/home', component: Home },
      ...routeList.value.filter(x => x.layoutType === 'DefaultLayout')
    ]
  },
  {
    path: '/',
    component: FullLayout,
    children: [
      // test
      { path: '/test', component: Home },
      ...routeList.value.filter(x => x.layoutType === 'FullLayout')
    ]
  },
  // 로그인 페이지
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  
  // Todo 관련 경로들은 별도로 처리 (TodoApp이 자체 레이아웃을 가지므로)
  { 
    path: '', 
    name: 'TodoApp',
    component: () => import('@/pages/TodoApp.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/todo', 
    name: 'TodoMain',
    component: () => import('@/pages/TodoApp.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/todo/inbox', 
    name: 'TodoInbox',
    component: () => import('@/pages/TodoApp.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/todo/today', 
    name: 'TodoToday',
    component: () => import('@/pages/TodoApp.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/todo/week', 
    name: 'TodoWeek',
    component: () => import('@/pages/TodoApp.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/todo/important', 
    name: 'TodoImportant',
    component: () => import('@/pages/TodoApp.vue'),
    meta: { requiresAuth: true }
  }
]

// router 생성
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 인증 가드
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAuthenticated = !!user
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/todo')
  } else {
    next()
  }
})

export default router
