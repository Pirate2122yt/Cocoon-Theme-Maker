import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function ExportTab() {
  const { metadata, wallpapers, sounds, smartFolderAssets, addNotification } = useThemeStore()

  const handleExport = async () => {
    if (window.electronAPI?.exportTheme) {
      const result = await window.electronAPI.exportTheme({
        theme: metadata,
        wallpapers,
        sounds,
        smartFolderAssets,
      })
      if (result?.canceled) return
      if (result?.error) {
        addNotification(result.error, 'error')
        return
      }
      addNotification('Theme exported successfully')
    } else {
      addNotification('Open in Electron app to export ZIP', 'info')
    }
  }

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button className="btn" onClick={handleExport} style={{ padding: '10px 16px' }}>
        Export theme ZIP
      </button>
    </div>
  )
}
