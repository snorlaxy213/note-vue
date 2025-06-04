import request from '@/network/request'

const state = {
  bookList: [],
  currentBook: {
    title: '',
    writer: '',
    img_url: '',
    status: '想读'
  },
  dialogVisible: false,
  loading: false,
  error: null,
  total: 0
}

const mutations = {
  SET_BOOK_LIST(state, books) {
    state.bookList = books
  },
  SET_CURRENT_BOOK(state, book) {
    state.currentBook = { ...book }
  },
  RESET_CURRENT_BOOK(state) {
    state.currentBook = {
      title: '',
      writer: '',
      img_url: '',
      status: '想读'
    }
  },
  SET_DIALOG_VISIBLE(state, visible) {
    state.dialogVisible = visible
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  ADD_BOOK(state, book) {
    state.bookList.unshift(book)
  },
  UPDATE_BOOK(state, updatedBook) {
    const index = state.bookList.findIndex(book => book.id === updatedBook.id)
    if (index !== -1) {
      state.bookList.splice(index, 1, updatedBook)
    }
  },
  DELETE_BOOK(state, bookId) {
    state.bookList = state.bookList.filter(book => book.id !== bookId)
  }
}

const actions = {
  async fetchBooks({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await request({
        url: '/my/book/get/all'
      })
      commit('SET_BOOK_LIST', response.data.items || [])
      commit('SET_TOTAL', response.data.total || 0)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async addBook({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const response = await request({
        method: 'post',
        url: '/my/book/add',
        data: state.currentBook
      })
      commit('ADD_BOOK', response.data.data)
      commit('RESET_CURRENT_BOOK')
      commit('SET_DIALOG_VISIBLE', false)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async updateBook({ commit }, book) {
    commit('SET_LOADING', true)
    try {
      await request({
        method: 'post',
        url: '/my/book/update',
        data: book
      })
      commit('UPDATE_BOOK', book)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async deleteBook({ commit }, bookId) {
    commit('SET_LOADING', true)
    try {
      await request({
        url: `/my/book/delete/${bookId}`
      })
      commit('DELETE_BOOK', bookId)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async uploadBookImage({ commit }, file) {
    commit('SET_LOADING', true)
    try {
      const formData = new FormData()
      formData.append('img', file)
      const response = await request({
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: '/qiniu/img_upload',
        data: formData
      })
      return response.data.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  bookList: state => state.bookList,
  currentBook: state => state.currentBook,
  isDialogVisible: state => state.dialogVisible,
  isLoading: state => state.loading,
  error: state => state.error,
  total: state => state.total
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}