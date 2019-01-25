import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState} from 'vuex-electron'

import modules from './modules'

const {ipcRenderer} = require('electron')

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
  updateState (state, newState) {
    state.rightCode = newState.rightCode
    state.activePanel = newState.activePanel
    state.inputFileList = newState.inputFileList
    state.activeInputFileIndex = newState.activeInputFileIndex
  },
  newState (state) {
    state.rightCode = ''
    state.activePanel = 'RightCode'
    state.inputFileList = [
      {type: 'manual', content: '', name: '文件 1'},
      {type: 'manual', content: '', name: '文件 2'},
      {type: 'code', content: '', name: '文件 3'}
    ]
    state.activeInputFileIndex = null
  },
  updateRightCode (state, value) {
    state.rightCode = value
  },
  updateFileLocation (state, value) {
    state.fileLocation = value
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
  },
  async openExistFile ({commit}) {
    const res = await ipcRenderer.sendSync('choose-acdb-file')
    if (res.result) {
      commit('updateState', res.state)
      commit('updateFileLocation', res.filePath)
    } else {
      throw new Error(res.error)
    }
  },
  async newProjectFile ({commit}, value) {
    const newState = {
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
    let res = await ipcRenderer.sendSync('new-acdb-file', {projectName: value, state: newState})
    if (res) {
      commit('newState')
      commit('updateFileLocation', res)
    }
  },
  async saveProjectFile ({commit, state}) {
    const res = await ipcRenderer.sendSync('save-acdb-file', {filePath: state.fileLocation, state})
    if (!res.result) {
      if (res.error.code === 'ENOENT') throw new Error('文件不存在，请尝试另存为')
      throw new Error(res.error.code)
    }
  },
  async anotherSaveProject ({commit, state}, value) {
    let res = await ipcRenderer.sendSync('new-acdb-file', {projectName: value, state})
    if (res) {
      commit('updateFileLocation', res)
    }
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
