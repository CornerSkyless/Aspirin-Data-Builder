'use strict'

import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
const exec = require('child_process').exec

const fs = require('fs')
let path = require('path')
let iconv = require('iconv-lite')

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
    width: 1200,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function removeDir (dir) {
  let files = fs.readdirSync(dir)
  for (let i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i])
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      // 如果是文件夹就递归下去
      removeDir(newPath)
    } else {
      // 删除文件
      fs.unlinkSync(newPath)
    }
  }
  fs.rmdirSync(dir)// 如果文件夹是空的，就将自己删除掉
}

const encoding = 'cp936'
const binaryEncoding = 'binary'

function iconvDecode (str = '') {
  return iconv.decode(Buffer.from(str, binaryEncoding), encoding)
}

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir (src, dist) {
  const paths = fs.readdirSync(src)
  paths.forEach(pa => {
    let _src = src + pa
    let _dist = dist + pa
    let stat = fs.statSync(_src)
    if (stat.isFile()) {
      fs.writeFileSync(_dist, fs.readFileSync(_src))
    } else {
      copyDir(_src, _dist)
    }
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
  if (fs.existsSync(dic)) {
    removeDir(dic)
  }
  fs.mkdirSync(dic)
  event.returnValue = true
})

ipcMain.on('copy-dictionary', (event, {from, to}) => {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to)
  }
  copyDir(from, to)
  event.returnValue = true
})

ipcMain.on('delete-dictionary', (event, dic) => {
  if (fs.existsSync(dic)) {
    removeDir(dic)
  }
  event.returnValue = true
})

ipcMain.on('write-text-input-file', (event, {text, location}) => {
  fs.writeFileSync(location, text, 'utf-8')
  event.returnValue = true
})

ipcMain.on('make-input-file', (event, {inputFile, index, dic, compileCommand, args}) => {
  const options = {
    encoding: 'utf8',
    timeout: 1200000
  }

  const cppPath = dic + index + '.cpp'
  const exePath = dic + index
  fs.writeFileSync(cppPath, inputFile.content, 'utf-8')
  compileCommand = compileCommand.replace(/\$cppPath\$/g, cppPath)
  exec(`${compileCommand} -o ${exePath}`, function (error, stdout, stderr) {
    if (error) event.returnValue = {result: false, error: iconvDecode(stderr)}
    else {
      const inputFilePath = dic + index + '.in'
      exec(`${exePath} ${args || ''} >${inputFilePath} `, options, function (error, stdout, stderr) {
        if (error) event.returnValue = {result: false, error: iconvDecode(stderr)}
        fs.unlinkSync(cppPath)
        if (fs.existsSync(exePath)) fs.unlinkSync(exePath)
        else fs.unlinkSync(exePath + '.exe')
        event.returnValue = {result: true}
      })
    }
  })
})

ipcMain.on('make-right-code', (event, {rightCode, dic, compileCommand}) => {
  const cppPath = dic + 'rightCode.cpp'
  const exePath = dic + 'rightCode'
  fs.writeFileSync(cppPath, rightCode, 'utf-8')
  compileCommand = compileCommand.replace(/\$cppPath\$/g, cppPath)
  exec(`${compileCommand} -o ${exePath}`, function (error, stdout, stderr) {
    if (error) event.returnValue = {result: false, error: iconvDecode(stderr)}
    event.returnValue = {result: true}
  })
})

ipcMain.on('make-output-file', (event, {index, dic}) => {
  const inputFilePath = dic + index + '.in'
  const outputFilePath = dic + index + '.out'
  const exePath = dic + 'rightCode'
  const options = {
    encoding: 'utf8',
    timeout: 1200000
  }
  exec(`${exePath} >${outputFilePath} < ${inputFilePath} `, options, function (error, stdout, stderr) {
    if (error) event.returnValue = {result: false, error: iconvDecode(stderr)}
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
