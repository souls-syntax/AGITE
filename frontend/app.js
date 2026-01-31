const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1900,
    height: 1080,
    resizable: false,
    frame: false,
    transparent: true
  })
  win.loadFile('index.html')
}

if (process.platform == 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu-compositing');
}

app.whenReady().then(() => {
  createWindow()
})
