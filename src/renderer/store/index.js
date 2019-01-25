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
    {type: 'manual', content: '', name: '文件 1'},
    {type: 'manual', content: '', name: '文件 2'},
    {type: 'manual', content: '', name: '文件 3'}
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
  },
  updateActiveInputFileContent (state, value) {
    state.inputFileList[state.activeInputFileIndex].content = value
  },
  addInputFile (state) {
    state.inputFileList.push({name: `文件   ${state.inputFileList.length + 1}`, content: '', type: 'manual'})
  },
  renameActiveInputFile (state, value) {
    state.inputFileList[state.activeInputFileIndex].name = value
  },
  deleteActiveInputFile (state) {
    if (state.activeInputFileIndex === state.inputFileList.length - 1) state.activeInputFileIndex--
    state.inputFileList.splice(state.activeInputFileIndex + 1, 1)
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
  },
  addInputFile ({commit, state}) {
    commit('addInputFile')
    commit('updateActiveInputFileIndex', state.inputFileList.length - 1)
    commit('updateActivePanel', 'InputFile')
  },
  renameActiveInputFile ({commit}, value) {
    commit('renameActiveInputFile', value)
  },
  deleteActiveInputFile ({commit}) {
    commit('deleteActiveInputFile')
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
