import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function SoundsTab() {
  const { sounds, addNotification } = useThemeStore()
  const soundNames = ['sfx_select', 'sfx_back', 'sfx_navigate', 'sfx_folder_open', 'sfx_game_launch']

  const handleAssign = async (name) => {
    if (window.electronAPI?.openAudio) {
      const result = await window.electronAPI.openAudio()
      if (result) addNotification(`${name} assigned`)
    } else {
      addNotification('Open in Electron app to assign sounds', 'info')
    }
  }

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {soundNames.map((name) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{name}</span>
          <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => handleAssign(name)}>
            Assign
          </button>
        </div>
      ))}
    </div>
  )
}
