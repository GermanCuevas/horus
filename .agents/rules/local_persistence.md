# Horus Architecture Rules: Local Storage & Offline-First

## Data Storage Guidelines
- **Zero External Server DB**: All user data, manuscripts, chapters, and character sheets reside strictly on the user's client device.
- **IndexedDB via Dexie.js**: Use Dexie.js for lightning-fast auto-saving, reactive querying, and offline storage of all manuscript items.
- **File System Access API**: Support direct reading and writing of `.horus` project bundles, Markdown files (`.md`), and exports (EPUB, PDF, DOCX) directly to the user's local filesystem.
- **Data Safety & Auto-Save**: Implement continuous background auto-saving with debounce (e.g. 500ms after last keystroke) to guarantee zero data loss.
