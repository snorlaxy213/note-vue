const state = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null
}

const mutations = {
  SET_NOTES(state, notes) {
    state.notes = notes
  },
  SET_CURRENT_NOTE(state, note) {
    state.currentNote = note
  },
  ADD_NOTE(state, note) {
    state.notes.push(note)
  },
  UPDATE_NOTE(state, updatedNote) {
    const index = state.notes.findIndex(note => note.id === updatedNote.id)
    if (index !== -1) {
      state.notes.splice(index, 1, updatedNote)
    }
  },
  DELETE_NOTE(state, noteId) {
    state.notes = state.notes.filter(note => note.id !== noteId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchNotes({ commit }) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      const notes = []
      commit('SET_NOTES', notes)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async createNote({ commit }, noteData) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      const newNote = { ...noteData, id: Date.now() }
      commit('ADD_NOTE', newNote)
      return newNote
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async updateNote({ commit }, noteData) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      commit('UPDATE_NOTE', noteData)
      return noteData
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async deleteNote({ commit }, noteId) {
    commit('SET_LOADING', true)
    try {
      // TODO: 实现API调用
      commit('DELETE_NOTE', noteId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  allNotes: state => state.notes,
  currentNote: state => state.currentNote,
  isLoading: state => state.loading,
  error: state => state.error,
  noteById: state => id => state.notes.find(note => note.id === id)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}