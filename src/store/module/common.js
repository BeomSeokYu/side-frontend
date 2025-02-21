import { httpGet } from '@/axios';


// 표시할 메뉴 리스트를 불러옴
// TODO 메뉴 리스트를 불러올 api url 설정
const menuList = await httpGet("/api/menu")
  .catch(() => {
    console.error('Failed to load menuList');
  });

// router에서 사용할 메뉴 리스트를 불러옴
// TODO 라우팅 될 메뉴 리스트를 불러올 api url 설정
const routeMenuList = await httpGet("/api/menu/route")
  .catch(() => {
    console.error('Failed to load routeMenuList');
  });

const initialState = () => ({
  menuList,
  routeMenuList,
});

// console.log('menuLists', initialState());

export const common = {
  namespaced: true,                                   // 동일한 명칭 사용

  state: initialState,                                // 상태 초기화

  getters: {                                          // 상태 가져오기 (like computed)
    menuList(state) {
      return state.menuList;
    },

    routeMenuList(state) {
      return state.routeMenuList;
    },
  },

  mutations: {                                        // 상태 변경 메서드
    initState(state) {
      Object.assign(state, initialState());
    },

    setMenuList(state, data) {
      state.menuList = data;
    },

    setRouteMenuList(state, data) {
      state.routeMenuList = data;
    },
  },

  actions: {                                          // 비동기 상태 변경 메서드
  },

  modules: {                                          // 필요한 경우 모듈 추가
  }
};