import React from 'react'
import useThemeStore from '../../store/themeStore'

export default function LivePreview() {
  const { metadata, wallpapers } = useThemeStore()
  const cs = metadata?.color_scheme || {}

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${cs.background_gradient_start || '#0a1929'}, ${cs.background_gradient_end || '#001e3c'})`,
        padding: 24,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          padding: 20,
          background: `linear-gradient(145deg, ${cs.card_gradient_start || '#1e2936'}, ${cs.card_gradient_end || '#132232'})`,
          borderRadius: 12,
          border: `1px solid ${cs.tile_border || '#2196f3'}`,
          color: cs.text_primary || '#e3f2fd',
          fontFamily: 'Syne, sans-serif',
        }}
      >
        <div style={{ fontSize: 12, color: cs.text_secondary || '#90caf9', marginBottom: 8 }}>Live Preview</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{metadata?.name || 'Untitled Theme'}</div>
        {wallpapers?.main && (
          <img
            src={wallpapers.main}
            alt="Main wallpaper"
            style={{
              width: '100%',
              marginTop: 12,
              borderRadius: 8,
              maxHeight: 160,
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    </div>
  )
}
