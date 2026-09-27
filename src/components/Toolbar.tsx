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
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 flex items-center justify-between z-30 select-none">
      
      {/* Left section: Sidebar toggle & Title Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          title="Alternar barra lateral"
          className={`p-2 rounded-lg transition ${
            sidebarOpen ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Sidebar className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <span className="text-xl">𓅃</span>
          <span className="font-serif font-semibold tracking-wide text-slate-200 text-sm">
            Horus
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            v1.0 Local
          </span>
        </div>
      </div>

      {/* Center Section: Typography & Paper Controls */}
      <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1 text-xs">
        
        {/* Font Select */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Type className="w-3.5 h-3.5" />
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as FontOption)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer border-none font-serif"
          >
            <option value="lora" className="bg-slate-900 text-slate-200">Lora (Serif)</option>
            <option value="merriweather" className="bg-slate-900 text-slate-200">Merriweather</option>
            <option value="playfair" className="bg-slate-900 text-slate-200">Playfair Display</option>
            <option value="inter" className="bg-slate-900 text-slate-200">Inter (Sans)</option>
            <option value="mono-code" className="bg-slate-900 text-slate-200">JetBrains Mono</option>
          </select>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Font Size */}
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px]">Tamaño</span>
          <button
            onClick={() => setFontSize(Math.max(14, fontSize - 1))}
            className="w-5 h-5 rounded hover:bg-slate-800 flex items-center justify-center text-slate-300"
          >
            -
          </button>
          <span className="font-mono w-4 text-center text-slate-200">{fontSize}</span>
          <button
            onClick={() => setFontSize(Math.min(28, fontSize + 1))}
            className="w-5 h-5 rounded hover:bg-slate-800 flex items-center justify-center text-slate-300"
          >
            +
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Horizontal Offset / Correr Hoja Slider */}
        <div className="flex items-center gap-2 text-slate-400" title="Correr la hoja de escritura a la izquierda o derecha">
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px]">Posición Hoja:</span>
          <input
            type="range"
            min="-250"
            max="250"
            step="10"
            value={paperMarginX}
            onChange={(e) => setPaperMarginX(Number(e.target.value))}
            className="w-20 accent-amber-500 h-1 rounded bg-slate-800 cursor-pointer"
          />
          {paperMarginX !== 0 && (
            <button
              onClick={() => setPaperMarginX(0)}
              className="text-[10px] text-amber-400 underline hover:text-amber-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Theme, Focus, Export */}
      <div className="flex items-center gap-2">
        
        {/* Typewriter mode button */}
        <button
          onClick={toggleTypewriterMode}
          title="Modo Máquina de Escribir (mantiene la línea activa al centro)"
          className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition ${
            typewriterMode
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Máquina</span>
        </button>

        {/* Theme Selectors */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setTheme('dark')}
            title="Tema Oscuro"
            className={`p-1.5 rounded ${theme === 'dark' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('sepia')}
            title="Tema Sepia Literario"
            className={`p-1.5 rounded font-serif text-[11px] font-bold px-2 ${theme === 'sepia' ? 'bg-amber-900/40 text-amber-200' : 'text-slate-400'}`}
          >
            Sepia
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Tema Claro"
            className={`p-1.5 rounded ${theme === 'light' ? 'bg-stone-200 text-stone-900' : 'text-slate-400'}`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
};
