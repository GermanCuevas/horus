import React from 'react';
import { useWritingStore, type FontOption } from '../store/useWritingStore';
import {
  Type,
  Sun,
  Moon,
  Feather,
  Sliders,
  Download,
  Sidebar
} from 'lucide-react';

interface ToolbarProps {
  onOpenExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenExport }) => {
  const {
    fontFamily,
    fontSize,
    paperMarginX,
    theme,
    zenMode,
    typewriterMode,
    sidebarOpen,
    setFontFamily,
    setFontSize,
    setPaperMarginX,
    setTheme,
    toggleTypewriterMode,
    toggleSidebar
  } = useWritingStore();

  if (zenMode) return null;

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 flex items-center justify-between z-30 select-none transition-colors duration-200">
      
      {/* Left section: Sidebar toggle & Title Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          title="Alternar barra lateral"
          className={`p-2 rounded-lg transition ${
            sidebarOpen ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Sidebar className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3">
          <span className="text-xl">𓅃</span>
          <span className="font-serif font-semibold tracking-wide text-[var(--text-primary)] text-ui-m">
            Horus
          </span>
          <span className="text-ui-s px-1.5 py-0.5 rounded bg-[var(--bg-surface-active)] text-[var(--text-secondary)] border border-[var(--border)] font-mono">
            v1.0 Local
          </span>
        </div>
      </div>

      {/* Center Section: Typography & Paper Controls */}
      <div className="flex items-center gap-4 bg-[var(--bg-app)] border border-[var(--border)] rounded-xl px-3 py-1 text-ui-s">
        
        {/* Font Select */}
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Type className="w-3.5 h-3.5" />
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as FontOption)}
            className="bg-transparent text-[var(--text-primary)] focus:outline-none cursor-pointer border-none font-serif text-ui-s"
          >
            <option value="lora" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Lora (Serif)</option>
            <option value="merriweather" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Merriweather</option>
            <option value="playfair" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Playfair Display</option>
            <option value="inter" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Inter (Sans)</option>
            <option value="mono-code" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">JetBrains Mono</option>
          </select>
        </div>

        <div className="h-4 w-px bg-[var(--border)]" />

        {/* Font Size */}
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="text-ui-s">Tamaño</span>
          <button
            onClick={() => setFontSize(Math.max(14, fontSize - 1))}
            className="w-5 h-5 rounded hover:bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-primary)]"
          >
            -
          </button>
          <span className="font-mono w-4 text-center text-[var(--text-primary)] text-ui-s">{fontSize}</span>
          <button
            onClick={() => setFontSize(Math.min(28, fontSize + 1))}
            className="w-5 h-5 rounded hover:bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-primary)]"
          >
            +
          </button>
        </div>

        <div className="h-4 w-px bg-[var(--border)]" />

        {/* Horizontal Offset / Correr Hoja Slider */}
        <div className="flex items-center gap-2 text-[var(--text-secondary)]" title="Correr la hoja de escritura a la izquierda o derecha">
          <Sliders className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span className="text-ui-s">Posición Hoja:</span>
          <input
            type="range"
            min="-250"
            max="250"
            step="10"
            value={paperMarginX}
            onChange={(e) => setPaperMarginX(Number(e.target.value))}
            className="w-20 accent-[var(--text-primary)] h-1 rounded bg-[var(--bg-surface-hover)] cursor-pointer"
          />
          {paperMarginX !== 0 && (
            <button
              onClick={() => setPaperMarginX(0)}
              className="text-ui-s text-[var(--text-primary)] underline hover:text-[var(--text-secondary)]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Theme (Dark / Light), Focus, Export */}
      <div className="flex items-center gap-2">
        
        {/* Typewriter mode button */}
        <button
          onClick={toggleTypewriterMode}
          title="Modo Máquina de Escribir (mantiene la línea activa al centro)"
          className={`p-2 rounded-lg text-ui-s flex items-center gap-1.5 transition ${
            typewriterMode
              ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] border border-[var(--border)] font-medium'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Máquina</span>
        </button>

        {/* Theme Selectors (Dark & Light) */}
        <div className="flex items-center bg-[var(--bg-app)] border border-[var(--border)] rounded-lg p-0.5">
          <button
            onClick={() => setTheme('dark')}
            title="Tema Oscuro Suave (Charcoal)"
            className={`p-1.5 rounded transition ${theme === 'dark' ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'}`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Tema Claro Suave (Gris Agradable)"
            className={`p-1.5 rounded transition ${theme === 'light' ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'}`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-active)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border)] text-ui-s font-medium transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
};
