import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState} from 'vuex-electron'

import modules from './modules'

const {ipcRenderer} = require('electron')

Vue.use(Vuex)

async function delay (time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const state = {
  version: '0.2.0',
  fileLocation: '',
  rightCode: '',
  activePanel: 'RightCode',
  inputFileList: [
    {type: 'manual', content: '', name: '文件 1', count: 1},
    {type: 'manual', content: '', name: '文件 2', count: 1},
    {type: 'manual', content: '', name: '文件 3', count: 1}
  ],
  activeInputFileIndex: null,
  isBuilding: false,
  buildStatus: '',
  buildError: '',
  progress: 0
}

const getters = {
  activeInputFileType (state) {
    if (state.activeInputFileIndex !== null) return state.inputFileList[state.activeInputFileIndex].type
    return null
  },
  activeInputFileContent (state) {
    if (state.activeInputFileIndex !== null) return state.inputFileList[state.activeInputFileIndex].content
    return null
  },
  activeInputFileCount (state) {
    if (state.activeInputFileIndex !== null) return state.inputFileList[state.activeInputFileIndex].count
    return null
  },
  hasEmpty (state) {
    if (!state.rightCode) return '标程不能为空'
    for (const inputFile of state.inputFileList) {
      if (!inputFile.content) return inputFile.name + '不能为空'
    }
    return false
  },
  fileDic (state) {
    const sp = process.platform === 'win32' ? `\\` : `/`
    const list = state.fileLocation.split(sp)
    list.splice(list.length - 1, 1)
    return list.join(sp) + sp
  },
  projectName (state) {
    const sp = process.platform === 'win32' ? `\\` : `/`
    let list = state.fileLocation.split(sp)
    const file = list[list.length - 1]
    list = file.split('.')
    list.splice(list.length - 1, 1)
    return list.join()
  }
}

const mutations = {
  updateState (state, newState) {
    state.rightCode = newState.rightCode
    state.activePanel = newState.activePanel
    state.inputFileList = newState.inputFileList.map(i => {
      if (i.type === 'code' && !i.count) i.count = 1
      return i
    })
    state.activeInputFileIndex = newState.activeInputFileIndex
  },
  newState (state) {
    state.rightCode = ''
    state.activePanel = 'RightCode'
    state.inputFileList = [
      {type: 'manual', content: '', name: '文件 1', count: 1},
      {type: 'manual', content: '', name: '文件 2', count: 1},
      {type: 'code', content: '', name: '文件 3', count: 1}
    ]
    state.activeInputFileIndex = null
  },
  updateRightCode (state, value) {
    state.rightCode = value
  },
  updateIsBuilding (state, value) {
    state.isBuilding = value
  },
  updateBuildStatus (state, value) {
    state.buildStatus = value
  },
  updateBuildError (state, value) {
    state.buildError = value
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
  updateActiveInputFileCount (state, value) {
    state.inputFileList[state.activeInputFileIndex].count = value
  },
  addInputFile (state) {
    state.inputFileList.push({name: `文件   ${state.inputFileList.length + 1}`, content: '', type: 'manual', count: 1})
  },
  renameActiveInputFile (state, value) {
    state.inputFileList[state.activeInputFileIndex].name = value
  },
  deleteActiveInputFile (state) {
    if (state.activeInputFileIndex === state.inputFileList.length - 1) {
      state.activeInputFileIndex--
      state.inputFileList.splice(state.activeInputFileIndex + 1, 1)
    } else {
      state.inputFileList.splice(state.activeInputFileIndex, 1)
    }
  },
  updateProgress (state, value) {
    state.progress = value
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
  updateActiveInputFileCount ({commit}, value) {
    commit('updateActiveInputFileCount', value)
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
  updateIsBuilding ({commit, value}) {
    commit('updateIsBuilding', value)
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
        {type: 'manual', content: '', name: '文件 1', count: 1},
        {type: 'manual', content: '', name: '文件 2', count: 1},
        {type: 'manual', content: '', name: '文件 3', count: 1}
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
  },
  async build ({commit, state, getters}) {
    commit('updateProgress', 0)
    commit('updateBuildError', '')
    commit('updateIsBuilding', true)
    commit('updateBuildStatus', '正在创建目录')
    await delay(100)
    console.log(getters.fileDic)
    console.log(getters.projectName)
    const outputDic = getters.fileDic + getters.projectName + new Date().valueOf() + '/'
    await ipcRenderer.sendSync('make-dictionary', outputDic)

    let fileIndex = 0
    for (let i = 0; i < state.inputFileList.length && !state.buildError; i++) {
      const inputFile = state.inputFileList[i]
      if (inputFile.type === 'manual') {
        commit('updateBuildStatus', '正在写入输入文件：' + inputFile.name)
        await delay(100)
        fileIndex++
        await ipcRenderer.sendSync('write-text-input-file', {
          text: inputFile.content,
          location: outputDic + fileIndex + '.in'
        })
      } else {
        commit('updateBuildStatus', '正在编译执行输入文件：' + inputFile.name)
        await delay(100)
        for (let j = 0; j < inputFile.count; j++) {
          fileIndex++
          const res = await ipcRenderer.sendSync('make-input-file', {inputFile, index: fileIndex, dic: outputDic})
          if (!res.result) {
            commit('updateBuildError', inputFile.name + ': ' + (res.error || '执行失败或超时'))
          }
        }
      }
      commit('updateProgress', Number((i / (state.inputFileList.length * 2) * 100).toFixed()))
    }

    commit('updateBuildStatus', '正在编译标程')

    const res = await ipcRenderer.sendSync('make-right-code', {rightCode: state.rightCode, dic: outputDic})
    if (!res.result) {
      commit('updateBuildError', '标程编译失败: ' + (res.error || '执行失败或超时'))
    }

    fileIndex = 0
    for (let i = 0; i < state.inputFileList.length && !state.buildError; i++) {
      const inputFile = state.inputFileList[i]

      commit('updateBuildStatus', '正在生成输出文件：' + inputFile.name)
      await delay(100)

      if (inputFile.type === 'manual') {
        fileIndex++
        const res = await ipcRenderer.sendSync('make-output-file', {index: fileIndex, dic: outputDic})
        if (!res.result) {
          commit('updateBuildError', inputFile.name + ': ' + (res.error || '执行失败或超时'))
        }
      } else {
        for (let j = 0; j < inputFile.count; j++) {
          fileIndex++
          const res = await ipcRenderer.sendSync('make-output-file', {index: fileIndex, dic: outputDic})
          if (!res.result) {
            commit('updateBuildError', inputFile.name + ': ' + (res.error || '执行失败或超时'))
          }
        }
      }

      commit('updateProgress', Number(((i + state.inputFileList.length) / (state.inputFileList.length * 2) * 100).toFixed()))
    }

    if (!state.buildError) {
      commit('updateIsBuilding', false)
      return outputDic
    } else {
      return false
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
