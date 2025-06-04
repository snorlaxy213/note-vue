const state = {
  folders: [],
  currentFolder: null,
  loading: false,
  error: null
}

const mutations = {
  SET_FOLDERS(state, folders) {
    state.folders = folders
  },
  SET_CURRENT_FOLDER(state, folder) {
    state.currentFolder = folder
  },
  ADD_FOLDER(state, folder) {
    state.folders.push(folder)
  },
  UPDATE_FOLDER(state, updatedFolder) {
    const index = state.folders.findIndex(folder => folder.id === updatedFolder.id)
    if (index !== -1) {
      state.folders.splice(index, 1, updatedFolder)
    }
  },
  DELETE_FOLDER(state, folderId) {
    state.folders = state.folders.filter(folder => folder.id !== folderId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchFolders({ commit }) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      const folders = []
      commit('SET_FOLDERS', folders)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async createFolder({ commit }, folderData) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      const newFolder = { ...folderData, id: Date.now() }
      commit('ADD_FOLDER', newFolder)
      return newFolder
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async updateFolder({ commit }, folderData) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      commit('UPDATE_FOLDER', folderData)
      return folderData
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async deleteFolder({ commit }, folderId) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      commit('DELETE_FOLDER', folderId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  allFolders: state => state.folders,
  currentFolder: state => state.currentFolder,
  isLoading: state => state.loading,
  error: state => state.error,
  folderById: state => id => state.folders.find(folder => folder.id === id)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}