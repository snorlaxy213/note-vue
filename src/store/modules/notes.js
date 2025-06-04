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

// 定义一个名为actions的对象，包含异步操作的saveTempNote方法
const actions = {

  /**
   * 异步方法saveTempNote，用于保存临时笔记
   * @param {Object} context - 上下文对象，包含commit方法，用于提交mutation
   * @param {Object} noteData - 要保存的笔记数据
   * @returns {Promise} - 返回一个Promise对象，包含服务器响应的数据
   */
  async saveTempNote({ commit }, noteData) {
    try {
      // 发起HTTP请求，保存临时笔记到服务器
      const resp = await request({
        url: '/article/temp_save',
        method: 'post',
        data: noteData
      });
      // 返回服务器响应的数据
      return resp.data;
    } catch (error) {
      // 当请求失败时，提交错误信息到store
      commit('SET_ERROR', error.message);
      // 重新抛出错误，以便调用者可以捕获
      throw error;
    }
  },

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
