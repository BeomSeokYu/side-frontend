import { createStore } from 'vuex'

import { common } from '@/store/module/common'
import { authorize } from '@/store/module/authorize'
import task from '@/store/modules/task'
import project from '@/store/modules/project'

export default createStore({
  modules: {
    common,
    authorize,
    task,
    project
  }
})
