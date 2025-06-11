import Vue from 'vue';
import Vuex from 'vuex';
import notes from './modules/notes';
import folders from './modules/folders';
import ui from './modules/ui';
import books from './modules/books';
import errors from './modules/errors';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    notes,
    folders,
    ui,
    books,
    errors
  },
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
