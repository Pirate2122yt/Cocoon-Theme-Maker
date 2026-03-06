import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function ColorsTab() {
  const { metadata, setColorScheme } = useThemeStore()
  const cs = metadata?.color_scheme || {}

  const colorKeys = Object.keys(cs)
  if (colorKeys.length === 0) return <div style={{ padding: 14 }}>No colors</div>

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {colorKeys.map((key) => (
        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="color"
            value={cs[key] || '#000000'}
            onChange={(e) => setColorScheme({ [key]: e.target.value })}
            style={{ width: 32, height: 24, border: 'none', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{key}</span>
        </label>
      ))}
    </div>
  )
}
