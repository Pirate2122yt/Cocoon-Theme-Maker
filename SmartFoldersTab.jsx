import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function SmartFoldersTab() {
  const { addNotification } = useThemeStore()
  return (
    <div style={{ padding: 14, color: 'var(--text-secondary)', fontSize: 13 }}>
      Upload platform icons, hero images, and logos for NES, SNES, N64, GBA, NDS, PSX, PS2, GameCube, and Favorites.
      Open in Electron to pick files.
    </div>
  )
}
