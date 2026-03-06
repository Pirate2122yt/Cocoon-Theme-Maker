import React from 'react'

export default function WelcomeScreen({ onDismiss }) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: 24,
        gap: 24,
      }}
    >
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, color: 'var(--text-primary)', margin: 0 }}>
        Launcher Theme Studio
      </h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 400 }}>
        Build Cocoon Shell themes with live preview. Set metadata, colors, wallpapers, sounds, and smart folder assets, then export a ZIP.
      </p>
      <button
        className="btn"
        onClick={onDismiss}
        style={{
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 700,
          background: 'var(--accent)',
          color: '#0d0d0f',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Create New Theme
      </button>
    </div>
  )
}
