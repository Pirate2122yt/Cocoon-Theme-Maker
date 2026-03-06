const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openImage: () => ipcRenderer.invoke('dialog:openImage'),
  openAudio: () => ipcRenderer.invoke('dialog:openAudio'),
  openThemeDir: () => ipcRenderer.invoke('dialog:openThemeDir'),
  exportTheme: (payload) => ipcRenderer.invoke('theme:export', payload),
  saveDraft: (payload) => ipcRenderer.invoke('theme:saveDraft', payload),
})
