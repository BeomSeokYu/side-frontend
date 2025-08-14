import { httpGet, httpPost, httpPut, httpPatch, httpDelete } from '@/axios'

const state = {
  projects: [],
  loading: false,
  error: null
}

const getters = {
  getAllProjects: state => state.projects,
  getProjectById: state => id => state.projects.find(project => project.projectId === id),
  getFavoriteProjects: state => state.projects.filter(project => project.isFavorite),
  getActiveProjects: state => state.projects.filter(project => !project.isArchived),
  isLoading: state => state.loading,
  getError: state => state.error
}

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  ADD_PROJECT(state, project) {
    state.projects.unshift(project)
  },
  UPDATE_PROJECT(state, updatedProject) {
    const index = state.projects.findIndex(project => project.projectId === updatedProject.projectId)
    if (index !== -1) {
      state.projects.splice(index, 1, updatedProject)
    }
  },
  REMOVE_PROJECT(state, projectId) {
    const index = state.projects.findIndex(project => project.projectId === projectId)
    if (index !== -1) {
      state.projects.splice(index, 1)
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
  async fetchProjects({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpGet('/api/projects')
      commit('SET_PROJECTS', response.data || [])
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createProject({ commit }, projectData) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPost('/api/projects', projectData)
      const newProject = response.data
      commit('ADD_PROJECT', newProject)
      return newProject
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProject({ commit }, { id, data }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPut(`/api/projects/${id}`, data)
      const updatedProject = response.data
      commit('UPDATE_PROJECT', updatedProject)
      return updatedProject
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteProject({ commit }, projectId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      await httpDelete(`/api/projects/${projectId}`)
      commit('REMOVE_PROJECT', projectId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async toggleFavorite({ commit }, projectId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const response = await httpPatch(`/api/projects/${projectId}/favorite`)
      const updatedProject = response.data
      commit('UPDATE_PROJECT', updatedProject)
      return updatedProject
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
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