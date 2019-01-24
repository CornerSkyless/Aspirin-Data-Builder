import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const state = {
  fileLocation: '',
  rightCode: '',
  activePanel: 'RightCode'
}

const mutations = {
  updateRightCode (state, value) {
    state.rightCode = value
  },
  updateActivePanel (state, value) {
    state.activePanel = value
  }
}

const actions = {
  updateRightCode ({commit}, value) {
    commit('updateRightCode', value)
  },
  updateActivePanel ({commit}, value) {
    commit('updateActivePanel', value)
  }
}
export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
