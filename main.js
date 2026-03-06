const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0d0d0f',
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Cocoon Theme Maker',
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5175')
    mainWindow.webContents.openDevTools()
  } else {
    // In the packaged app, dist/ is bundled next to main.js inside the asar
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ── IPC Handlers ─────────────────────────────────────────────────────────────

// Select image file (wallpaper / preview / icon)
ipcMain.handle('dialog:openImage', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }],
  })
  if (result.canceled) return null
  const filePath = result.filePaths[0]
  const data = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mime = ext === '.gif' ? 'image/gif' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'
  return {
    filePath,
    fileName: path.basename(filePath),
    dataUrl: `data:${mime};base64,${data.toString('base64')}`,
  }
})

// Select audio file (sound effects)
ipcMain.handle('dialog:openAudio', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['wav', 'mp3', 'ogg'] }],
  })
  if (result.canceled) return null
  const filePath = result.filePaths[0]
  return {
    filePath,
    fileName: path.basename(filePath),
    ext: path.extname(filePath).toLowerCase().replace('.', ''),
  }
})

// Open existing theme directory
ipcMain.handle('dialog:openThemeDir', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Theme Folder',
  })
  if (result.canceled) return null
  const themeDir = result.filePaths[0]
  const jsonPath = path.join(themeDir, 'theme.json')
  if (!fs.existsSync(jsonPath)) {
    return { error: 'No theme.json found in selected directory.' }
  }
  try {
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    // Load wallpapers as data URLs
    const wallpapers = {}
    for (const [key, filename] of Object.entries({ main: json.wallpaper_main, external: json.wallpaper_external })) {
      if (!filename) continue
      for (const ext of ['png', 'jpg', 'jpeg']) {
        const wp = path.join(themeDir, 'wallpapers', `${filename}.${ext}`)
        if (fs.existsSync(wp)) {
          const data = fs.readFileSync(wp)
          wallpapers[key] = `data:image/${ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png'};base64,${data.toString('base64')}`
          break
        }
      }
    }
    // Load sounds list
    const soundsDir = path.join(themeDir, 'sounds')
    const sounds = {}
    if (fs.existsSync(soundsDir)) {
      fs.readdirSync(soundsDir).forEach(f => {
        const name = path.basename(f, path.extname(f))
        sounds[name] = { filePath: path.join(soundsDir, f), fileName: f }
      })
    }
    return { theme: json, wallpapers, sounds, themeDir }
  } catch (e) {
    return { error: 'Failed to parse theme.json: ' + e.message }
  }
})

// Export theme as ZIP
ipcMain.handle('theme:export', async (event, { theme, wallpapers, sounds, smartFolderAssets }) => {
  const result = await dialog.showSaveDialog({
    title: 'Export Theme',
    defaultPath: `${theme.name.replace(/\s+/g, '_')}_v${theme.version}.zip`,
    filters: [{ name: 'ZIP Archive', extensions: ['zip'] }],
  })
  if (result.canceled) return { canceled: true }

  try {
    const zip = new AdmZip()
    const themeSlug = theme.name.toLowerCase().replace(/\s+/g, '-')

    // theme.json
    const colorScheme = { ...theme.color_scheme }
    if (!theme.useCustomAccent) {
      delete colorScheme.accent_gradient_start
      delete colorScheme.accent_gradient_end
      delete colorScheme.accent_glow
    }
    const themeJson = {
      name: theme.name,
      author: theme.author,
      version: theme.version,
      description: theme.description,
      ...(theme.credits && { credits: theme.credits }),
      ...(theme.website && { website: theme.website }),
      wallpaper_main: 'main',
      wallpaper_external: 'external',
      color_scheme: colorScheme,
    }
    zip.addFile(`${themeSlug}/theme.json`, Buffer.from(JSON.stringify(themeJson, null, 2), 'utf-8'))

    // Wallpapers
    for (const [key, dataUrl] of Object.entries(wallpapers)) {
      if (!dataUrl) continue
      const base64 = dataUrl.split(',')[1]
      if (!base64) continue
      const ext = dataUrl.startsWith('data:image/jpeg') ? 'jpg' : 'png'
      zip.addFile(`${themeSlug}/wallpapers/${key}.png`, Buffer.from(base64, 'base64'))
    }

    // Sounds
    for (const [sfxKey, soundInfo] of Object.entries(sounds)) {
      if (!soundInfo || !soundInfo.filePath) continue
      try {
        const soundData = fs.readFileSync(soundInfo.filePath)
        zip.addFile(`${themeSlug}/sounds/${soundInfo.fileName}`, soundData)
      } catch {}
    }

    // Smart folder assets
    for (const [platform, assets] of Object.entries(smartFolderAssets || {})) {
      for (const [assetType, dataUrl] of Object.entries(assets || {})) {
        if (!dataUrl) continue
        const base64 = dataUrl.split(',')[1]
        if (!base64) continue
        const ext = assetType === 'hero' ? 'gif' : 'png'
        const folder = platform === 'favorites' ? 'favorites' : `by_platform/${platform}`
        zip.addFile(`${themeSlug}/smart_folders/${folder}/${assetType}.${ext}`, Buffer.from(base64, 'base64'))
      }
    }

    zip.writeZip(result.filePath)
    return { success: true, filePath: result.filePath }
  } catch (e) {
    return { error: e.message }
  }
})

// Save draft to directory
ipcMain.handle('theme:saveDraft', async (event, { theme, wallpapers, sounds }) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select folder to save draft theme',
  })
  if (result.canceled) return { canceled: true }
  const themeSlug = theme.name.toLowerCase().replace(/\s+/g, '-')
  const themeDir = path.join(result.filePaths[0], themeSlug)
  fs.mkdirSync(path.join(themeDir, 'wallpapers'), { recursive: true })
  fs.mkdirSync(path.join(themeDir, 'sounds'), { recursive: true })
  fs.writeFileSync(path.join(themeDir, 'theme.json'), JSON.stringify(theme, null, 2))
  return { success: true, themeDir }
})
