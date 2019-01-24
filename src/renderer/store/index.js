import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState} from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const state = {
  fileLocation: '',
  rightCode: '',
  activePanel: 'RightCode',
  inputFileList: [
    {type: 'manual', content: ''},
    {type: 'manual', content: ''},
    {type: 'manual', content: ''}
  ],
  activeInputFileIndex: null
}

const getters = {
  activeInputFileType (state) {
    if (state.activeInputFileIndex !== null) return state.inputFileList[state.activeInputFileIndex].type
    return null
  },
  activeInputFileContent (state) {
    if (state.activeInputFileIndex !== null) return state.inputFileList[state.activeInputFileIndex].content
    return null
  }
}

const mutations = {
  updateRightCode (state, value) {
    state.rightCode = value
  },
  updateActivePanel (state, value) {
    state.activePanel = value
  },
  updateActiveInputFileIndex (state, value) {
    state.activeInputFileIndex = value
  },
  updateActiveInputFileType (state, value) {
    state.inputFileList[state.activeInputFileIndex].type = value
    state.inputFileList.splice(state.activeInputFileIndex, 1, state.inputFileList[state.activeInputFileIndex])
  },
  updateActiveInputFileContent (state, value) {
    state.inputFileList[state.activeInputFileIndex].content = value
    state.inputFileList.splice(state.activeInputFileIndex, 1, state.inputFileList[state.activeInputFileIndex])
  }
}

const actions = {
  updateRightCode ({commit}, value) {
    commit('updateRightCode', value)
  },
  updateActivePanel ({commit}, value) {
    commit('updateActivePanel', value)
  },
  updateActiveInputFileIndex ({commit}, value) {
    commit('updateActiveInputFileIndex', value)
  },
  updateActiveInputFileType ({commit}, value) {
    commit('updateActiveInputFileType', value)
  },
  updateActiveInputFileContent ({commit}, value) {
    commit('updateActiveInputFileContent', value)
  }
}
export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState()
    // createSharedMutations()
  ],
  state,
  mutations,
  actions,
  getters,
  strict: process.env.NODE_ENV !== 'production'
})
