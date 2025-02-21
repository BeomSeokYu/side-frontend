import { httpGet } from '@/axios'

function initialState() {
  return {
    menuList: [],
  };
}
export const sample = {
  namespaced: true,                                   // 동일한 명칭 사용

  state: initialState,                                // 상태 초기화

  getters: {                                          // 상태 가져오기 (like computed)
  },

  mutations: {                                        // 상태 변경 메서드
    initState(state) {
      Object.assign(state, initialState());
    },

    setMenuList(state, data) {
      state.menuList = data;
    },
  },

  actions: {                                          // 비동기 상태 변경 메서드
    async importMenuList({ commit }) {
      const data = await httpGet("/api/menu");
      commit('setMenuList', data);
    }
  },

  modules: {                                          // 필요한 경우 모듈 추가
  }
};
