import React, { useState } from 'react'
import useThemeStore from './store/themeStore'
import LivePreview from './components/preview/LivePreview'
import MetadataTab from './components/tabs/MetadataTab'
import ColorsTab from './components/tabs/ColorsTab'
import WallpapersTab from './components/tabs/WallpapersTab'
import SoundsTab from './components/tabs/SoundsTab'
import SmartFoldersTab from './components/tabs/SmartFoldersTab'
import ExportTab from './components/tabs/ExportTab'
import WelcomeScreen from './components/shared/WelcomeScreen'
import {
  Tag, Palette, Image, Music, Folder, Download,
  RotateCcw, Gamepad2, FolderOpen
} from 'lucide-react'

const TABS = [
  { id: 'metadata', label: 'Metadata', icon: Tag },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'wallpapers', label: 'Wallpapers', icon: Image },
  { id: 'sounds', label: 'Sounds', icon: Music },
  { id: 'smartfolders', label: 'Smart Folders', icon: Folder },
  { id: 'export', label: 'Export', icon: Download },
]

function TabContent({ tab }) {
  switch (tab) {
    case 'metadata': return <MetadataTab />
    case 'colors': return <ColorsTab />
    case 'wallpapers': return <WallpapersTab />
    case 'sounds': return <SoundsTab />
    case 'smartfolders': return <SmartFoldersTab />
    case 'export': return <ExportTab />
    default: return null
  }
}

function ToastContainer() {
  const notifications = useThemeStore((s) => s.notifications)
  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className={`toast toast-${n.type || 'success'}`}>
          {n.msg}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const { activeTab, setActiveTab, metadata, resetTheme, loadTheme, addNotification } = useThemeStore()
  const [showWelcome, setShowWelcome] = useState(true)

  const handleLoadTheme = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.openThemeDir()
      if (!result) return
      if (result.error) { addNotification(result.error, 'error'); return }
      loadTheme(result)
      addNotification('Theme loaded')
    }
  }

  const handleReset = () => {
    if (confirm('Reset all theme data? This cannot be undone.')) {
      resetTheme()
      addNotification('Theme reset', 'info')
    }
  }

  if (showWelcome) {
    return (
      <>
        <WelcomeScreen onDismiss={() => setShowWelcome(false)} />
        <ToastContainer />
      </>
    )
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-base)',
      overflow: 'hidden',
    }}>
      {/* Title Bar / Header */}
      <div style={{
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 0 72px', // 72px left for macOS traffic lights
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
        WebkitAppRegion: 'drag', // macOS draggable titlebar
        userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, WebkitAppRegion: 'no-drag' }}>
          <Gamepad2 size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
            COCOON THEME MAKER
          </span>
          {metadata.name && (
            <>
              <span style={{ color: 'var(--border-muted)' }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{metadata.name}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, WebkitAppRegion: 'no-drag' }}>
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={handleLoadTheme}>
            <FolderOpen size={12} /> Load
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={handleReset}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: 180,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <nav className="tab-nav" style={{ flex: 1 }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`tab-item ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="tab-icon" />
                {label}
              </div>
            ))}
          </nav>

          {/* Bottom branding */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 6px var(--success)',
            }} />
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.06em' }}>
              COCOON SHELL
            </span>
          </div>
        </div>

        {/* Config Panel */}
        <div style={{
          width: 340,
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-base)',
        }}>
          {/* Tab Header */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            background: 'var(--bg-surface)',
          }}>
            {(() => {
              const tab = TABS.find(t => t.id === activeTab)
              if (!tab) return null
              const Icon = tab.icon
              return (
                <>
                  <Icon size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{tab.label}</span>
                </>
              )
            })()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <TabContent tab={activeTab} />
          </div>
        </div>

        {/* Live Preview */}
        <div className="preview-panel" style={{ flex: 1 }}>
          <LivePreview />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
