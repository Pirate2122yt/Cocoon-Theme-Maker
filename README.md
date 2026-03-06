# Cocoon Theme Maker

A full Cocoon Shell theme builder with live previews, color palette editing, sound pack management, smart folder asset control, and one-click ZIP export.

## Features

- 🎨 **Full Color Editor** — Visual color pickers for 18 theme.json color properties, organized by category with gradient previews
- 🖼️ **Wallpaper Management** — Upload main and external display wallpapers (PNG/JPG)
- 🔊 **Sound Pack** — Assign custom audio files (.wav/.mp3/.ogg) to 5 UI events
- 📁 **Smart Folders** — Upload platform icons, hero images, and logos for NES, SNES, N64, GBA, NDS, PSX, PS2, GameCube, and Favorites
- 📦 **ZIP Export** — One-click export to a valid Cocoon theme ZIP package with correct folder structure
- 💾 **Draft Saving** — Save work-in-progress themes to disk
- 📂 **Load Existing Themes** — Open and edit existing theme directories

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Run in development mode (opens Electron + Vite dev server)
npm run dev

# Build for production
npm run build
```

### Development

```bash
# Start Vite dev server only (browser preview at http://localhost:5173)
npm run dev:react

# Start full Electron app
npm run dev
```

## Theme Output Structure

When you export a theme, the ZIP will contain:


## theme.json Format

```json
{
  "name": "Ocean Theme",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "A cool ocean-inspired theme",
  "credits": "Wallpaper by ...",
  "website": "https://yoursite.com",
  "wallpaper_main": "main",
  "wallpaper_external": "external",
  "color_scheme": {
    "background_gradient_start": "#0a1929",
    "background_gradient_end": "#001e3c",
    "card_gradient_start": "#1e2936",
    "card_gradient_end": "#132232",
    "text_primary": "#e3f2fd",
    "text_secondary": "#90caf9",
    "icon_tint": "#64b5f6",
    "tile_background": "#1a2332",
    "tile_border": "#2196f3",
    "toggle_off_gradient_start": "#37474f",
    "toggle_off_gradient_end": "#263238",
    "toggle_thumb_gradient_start": "#90caf9",
    "toggle_thumb_gradient_end": "#42a5f5",
    "drop_shadow": "#000000",
    "inner_shadow_light": "#ffffff",
    "inner_shadow_dark": "#000000",
    "success": "#4caf50",
    "warning": "#ff9800",
    "divider": "#37474f",
    "accent_gradient_start": "#90bdf8",
    "accent_gradient_end": "#57b3ff",
    "accent_glow": "#57b3ff"
  }
}
```

## Tech Stack

- **Electron** — Cross-platform desktop runtime
- **React 18** — UI framework
- **Zustand** — State management
- **Vite** — Build tool / dev server
- **react-colorful** — Color picker component
- **adm-zip** — ZIP file creation (Node.js)
- **Syne + Space Mono** — Typography

## Color Reference

| Key | Purpose |
|-----|---------|
| `background_gradient_start/end` | Main UI background gradient |
| `card_gradient_start/end` | Panel and card backgrounds |
| `text_primary` | Titles and selected items |
| `text_secondary` | Metadata and subtitles |
| `icon_tint` | Color overlay on UI icons |
| `tile_background` | Game tile base color |
| `tile_border` | Game tile border/highlight |
| `toggle_off_gradient_start/end` | Toggle switch off-state background |
| `toggle_thumb_gradient_start/end` | Toggle switch handle color |
| `drop_shadow` | External drop shadow color |
| `inner_shadow_light/dark` | Bevel/depth effects |
| `success` | Positive status (scrape success, etc.) |
| `warning` | Warning/error indicators |
| `divider` | Separator line color |
| `accent_gradient_start/end` | Interactive element accent (optional) |
| `accent_glow` | Glow effect on focused elements (optional) |

## License

MIT
