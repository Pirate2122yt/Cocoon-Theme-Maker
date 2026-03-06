import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function MetadataTab() {
  const { metadata, setMetadata } = useThemeStore()

  const fields = [
    { key: 'name', label: 'Theme Name' },
    { key: 'author', label: 'Author' },
    { key: 'version', label: 'Version' },
    { key: 'description', label: 'Description' },
    { key: 'credits', label: 'Credits' },
    { key: 'website', label: 'Website' },
  ]

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {fields.map(({ key, label }) => (
        <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
          <input
            type="text"
            value={metadata[key] || ''}
            onChange={(e) => setMetadata({ [key]: e.target.value })}
            style={{
              padding: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              color: 'var(--text-primary)',
              fontSize: 13,
            }}
          />
        </label>
      ))}
    </div>
  )
}
