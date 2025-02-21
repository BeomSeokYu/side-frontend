import { createStore } from 'vuex'

import { common } from '@/store/module/common'
import { authorize } from '@/store/module/authorize'

export default createStore({
  modules: {
    common,
    authorize,
  }
})
