import { httpGet, httpPost, httpPut, httpPatch, httpDelete } from '@/axios'

const state = {
  tasks: [],
  loading: false,
  error: null
}

const getters = {
  getAllTasks: state => state.tasks,
  getTaskById: state => id => state.tasks.find(task => task.taskId === id),
  getTodayTasks: state => {
    const today = new Date().toDateString()
    return state.tasks.filter(task => 
      new Date(task.endDate).toDateString() === today && !task.isCompleted
    )
  },
  getImportantTasks: state => state.tasks.filter(task => task.isImportant && !task.isCompleted),
  getUpcomingTasks: state => {
    const weekLater = new Date()
    weekLater.setDate(weekLater.getDate() + 7)
    return state.tasks.filter(task => 
      new Date(task.endDate) <= weekLater && !task.isCompleted
    )
  },
  getTasksByProject: state => projectId => 
    state.tasks.filter(task => task.projectId === projectId),
  isLoading: state => state.loading,
  getError: state => state.error
}

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  ADD_TASK(state, task) {
    state.tasks.unshift(task)
  },
  UPDATE_TASK(state, updatedTask) {
    const index = state.tasks.findIndex(task => task.taskId === updatedTask.taskId)
    if (index !== -1) {
      state.tasks.splice(index, 1, updatedTask)
    }
  },
  REMOVE_TASK(state, taskId) {
    const index = state.tasks.findIndex(task => task.taskId === taskId)
    if (index !== -1) {
      state.tasks.splice(index, 1)
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  async fetchTasks({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpGet('/api/tasks')
      commit('SET_TASKS', response.data || [])
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createTask({ commit }, taskData) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPost('/api/tasks', taskData)
      const newTask = response.data
      commit('ADD_TASK', newTask)
      return newTask
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateTask({ commit }, { id, data }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPut(`/api/tasks/${id}`, data)
      const updatedTask = response.data
      commit('UPDATE_TASK', updatedTask)
      return updatedTask
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async completeTask({ commit }, taskId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPatch(`/api/tasks/${taskId}/complete`)
      const updatedTask = response.data
      commit('UPDATE_TASK', updatedTask)
      return updatedTask
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async uncompleteTask({ commit }, taskId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPatch(`/api/tasks/${taskId}/uncomplete`)
      const updatedTask = response.data
      commit('UPDATE_TASK', updatedTask)
      return updatedTask
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteTask({ commit }, taskId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      await httpDelete(`/api/tasks/${taskId}`)
      commit('REMOVE_TASK', taskId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async toggleImportant({ commit }, taskId) {
    const task = state.tasks.find(t => t.taskId === taskId)
    if (task) {
      const updatedTask = {
        ...task,
        isImportant: !task.isImportant
      }
      commit('UPDATE_TASK', updatedTask)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}