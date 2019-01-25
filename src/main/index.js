'use strict'

import {app, BrowserWindow, ipcMain, dialog} from 'electron'
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
    properties: ['openFile']
  }, function (files) {
    if (files) event.returnValue = files
    else event.returnValue = false
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
