import request from '@/network/request';

const state = {
  notes: [],
  currentNote: {
    id: null,
    created_at: '',
    updated_at: '',
    title: '',
    dir_path: [],
    mkValue: '',
    folder_id: 0
  },
  loading: false,
  error: null,
  articleList: [],
  articleDetail: null,
  tags: [],
  pagination: {
    currentPage: 1,
    total: 0,
    pageSize: 10
  },
  rubbishArticles: []
};

const mutations = {
  SET_NOTES(state, notes) {
    state.notes = notes;
  },
  SET_CURRENT_NOTE(state, note) {
    state.currentNote = note;
  },
  ADD_NOTE(state, note) {
    state.notes.push(note);
  },
  UPDATE_NOTE(state, updatedNote) {
    const index = state.notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      state.notes.splice(index, 1, updatedNote);
    }
  },
  DELETE_NOTE(state, noteId) {
    state.notes = state.notes.filter(note => note.id !== noteId);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_ARTICLE_LIST(state, articles) {
    state.articleList = articles;
  },
  SET_ARTICLE_DETAIL(state, article) {
    state.articleDetail = article;
  },
  SET_TAGS(state, tags) {
    state.tags = tags;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },
  SET_RUBBISH_ARTICLES(state, articles) {
    state.rubbishArticles = articles;
  },
  ADD_TAG(state, tag) {
    if (!state.tags.includes(tag)) {
      state.tags.push(tag);
    }
  },
  REMOVE_TAG(state, tag) {
    state.tags = state.tags.filter(t => t !== tag);
  },
  DELETE_ARTICLE_FROM_LIST(state, articleId) {
    state.articleList = state.articleList.filter(
      article => article.id !== articleId
    );
  },
  RECOVER_ARTICLE(state, articleId) {
    state.rubbishArticles = state.rubbishArticles.filter(
      article => article.id !== articleId
    );
  }
};

const actions = {
  async fetchNotes({ commit }) {
    commit('SET_LOADING', true);
    try {
      // TODO: 实现API调用
      const notes = [];
      commit('SET_NOTES', notes);
    } catch (error) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async createNote({ commit }, noteData) {
    commit('SET_LOADING', true);
    try {
      // TODO: 实现API调用
      const newNote = { ...noteData, id: Date.now() };
      commit('ADD_NOTE', newNote);
      return newNote;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async updateNote({ commit }, noteData) {
    commit('SET_LOADING', true);
    try {
      // TODO: 实现API调用
      commit('UPDATE_NOTE', noteData);
      return noteData;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async deleteNote({ commit }, noteId) {
    commit('SET_LOADING', true);
    try {
      // TODO: 实现API调用
      commit('DELETE_NOTE', noteId);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async fetchTempNote({ commit }) {
    commit('SET_LOADING', true);
    try {
      const resp = await request({
        url: '/article/temp_get'
      });
      const note = resp.data.data;
      commit('SET_CURRENT_NOTE', note);
      return note;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async saveTempNote({ commit }, noteData) {
    try {
      const resp = await request({
        url: '/article/temp_save',
        method: 'post',
        data: noteData
      });
      return resp.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  },

  async saveNote({ commit }, noteData) {
    commit('SET_LOADING', true);
    try {
      // TODO: 实现文章保存API调用
      const resp = await request({
        url: '/article/save',
        method: 'post',
        data: noteData
      });
      commit('UPDATE_NOTE', resp.data.data);
      return resp.data.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  allNotes: state => state.notes,
  currentNote: state => state.currentNote,
  isLoading: state => state.loading,
  error: state => state.error,
  noteById: state => id => state.notes.find(note => note.id === id)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
