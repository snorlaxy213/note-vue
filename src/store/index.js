import Vue from 'vue'
import Vuex from 'vuex'
import notes from './modules/notes'
import folders from './modules/folders'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    notes,
    folders,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store