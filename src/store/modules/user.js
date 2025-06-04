const state = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  CLEAR_USER(state) {
    state.user = null
    state.isAuthenticated = false
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      const user = { ...credentials, id: Date.now() }
      commit('SET_USER', user)
      return user
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async logout({ commit }) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      commit('CLEAR_USER')
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchUser({ commit }) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      const user = null
      commit('SET_USER', user)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  currentUser: state => state.user,
  isAuthenticated: state => state.isAuthenticated,
  isLoading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}