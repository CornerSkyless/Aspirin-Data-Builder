'use strict'

import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
const exec = require('child_process').exec

const fs = require('fs')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://noi.top') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  /**
     * Initial window options
     */
  mainWindow = new BrowserWindow({
    height: 600,
    resizable: false,
    width: 1000,
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('close-window', (event) => {
  app.quit()
  event.returnValue = true
})

ipcMain.on('minus-window', (event) => {
  mainWindow.minimize()
  event.returnValue = true
})

ipcMain.on('choose-acdb-file', (event) => {
  dialog.showOpenDialog({
    title: '选择项目文件',
    properties: ['openFile'],
    filters: [
      {name: '数据生成器文件', extensions: ['acdb']}
    ]
  }, function (files) {
    if (files) {
      const filePath = files[0]
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const state = JSON.parse(content)
        event.returnValue = {
          result: true,
          state,
          filePath
        }
      } catch (e) {
        event.returnValue = {
          result: false,
          error: '访问权限不足或文件已损坏'
        }
      }
    } else {
      event.returnValue = {
        result: false
      }
    }
  })
})

ipcMain.on('new-acdb-file', (event, args) => {
  dialog.showOpenDialog({
    title: '选择保存目录',
    properties: ['openDirectory']
  }, function (files) {
    if (files) {
      const dic = files[0]
      const filePath = dic + '/' + args.projectName + '.acdb'
      fs.writeFileSync(filePath, JSON.stringify(args.state))
      event.returnValue = filePath
    } else event.returnValue = false
  })
})

ipcMain.on('save-acdb-file', (event, args) => {
  try {
    const filePath = args.filePath
    const content = JSON.stringify(args.state)
    fs.writeFileSync(filePath, content)
    event.returnValue = {result: true}
  } catch (e) {
    event.returnValue = {result: false, error: e}
  }
})

ipcMain.on('check-dictionary', (event, dic) => {
  event.returnValue = fs.existsSync(dic)
})

ipcMain.on('make-dictionary', (event, dic) => {
  fs.mkdirSync(dic)
  event.returnValue = true
})

ipcMain.on('write-text-input-file', (event, {text, location}) => {
  fs.writeFileSync(location, text, 'utf-8')
  event.returnValue = true
})

ipcMain.on('make-input-file', (event, {inputFile, index, dic}) => {
  const options = {
    encoding: 'utf8',
    timeout: 10000
  }

  const cppPath = dic + index + '.cpp'
  const exePath = dic + index
  fs.writeFileSync(cppPath, inputFile.content, 'utf-8')
  exec(`g++ -o2 ${cppPath} -o ${exePath}`, function (error, stdout, stderr) {
    if (error) event.returnValue = {result: false, error: stderr}
    else {
      const inputFilePath = dic + index + '.in'
      exec(`${exePath} >${inputFilePath} `, options, function (error, stdout, stderr) {
        if (error) event.returnValue = {result: false, error: stderr}
        fs.unlinkSync(cppPath)
        fs.unlinkSync(exePath)
        event.returnValue = {result: true}
      })
    }
  })
})

ipcMain.on('make-right-code', (event, {rightCode, dic}) => {
  const cppPath = dic + 'rightCode.cpp'
  const exePath = dic + 'rightCode'
  fs.writeFileSync(cppPath, rightCode, 'utf-8')
  exec(`g++ -o2 ${cppPath} -o ${exePath}`, function (error, stdout, stderr) {
    if (error) event.returnValue = {result: false, error: stderr}
    event.returnValue = {result: true}
  })
})

ipcMain.on('make-output-file', (event, {index, dic}) => {
  const inputFilePath = dic + index + '.in'
  const outputFilePath = dic + index + '.out'
  const exePath = dic + 'rightCode'
  const options = {
    encoding: 'utf8',
    timeout: 10000
  }
  exec(`${exePath} >${outputFilePath} < ${inputFilePath} `, options, function (error, stdout, stderr) {
    if (error) event.returnValue = {result: false, error: stderr}
    event.returnValue = {result: true}
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
