import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function WallpapersTab() {
  const { wallpapers, setWallpapers, addNotification } = useThemeStore()

  const handleSelect = async (key) => {
    if (window.electronAPI?.openImage) {
      const result = await window.electronAPI.openImage()
      if (result) {
        setWallpapers({ [key]: result.dataUrl })
        addNotification(`${key} wallpaper set`)
      }
    } else {
      addNotification('Open in Electron app to pick files', 'info')
    }
  }

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {['main', 'external'].map((key) => (
        <div key={key}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>Wallpaper {key}</div>
          {wallpapers[key] ? (
            <img src={wallpapers[key]} alt={key} style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8 }} />
          ) : (
            <div style={{ height: 80, background: 'var(--bg-surface)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No image
            </div>
          )}
          <button className="btn btn-ghost" style={{ marginTop: 6 }} onClick={() => handleSelect(key)}>
            Choose image
          </button>
        </div>
      ))}
    </div>
  )
}
