import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { useWritingStore } from '../store/useWritingStore';
import { db, type ManuscriptItem } from '../db/database';
import { Clock, BookOpen, Maximize2, Minimize2 } from 'lucide-react';

interface EditorProps {
  item: ManuscriptItem | null;
}

export const Editor: React.FC<EditorProps> = ({ item }) => {
  const {
    fontFamily,
    fontSize,
    lineHeight,
    paperWidth,
    paperMarginX,
    theme,
    zenMode,
    typewriterMode,
    toggleZenMode
  } = useWritingStore();

  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Empieza a escribir tu obra con soltura y elegancia...',
      }),
      CharacterCount,
      TextStyle,
      FontFamily,
    ],
    content: item?.content || '',
    onUpdate: async ({ editor }) => {
      if (!item || !item.id) return;
      const htmlContent = editor.getHTML();
      const words = editor.storage.characterCount.words();
      
      // Update IndexedDB in background
      await db.items.update(item.id, {
        content: htmlContent,
        wordCount: words,
        updatedAt: new Date(),
      });
    },
  });

  // Sync editor content when active item changes
  useEffect(() => {
    if (editor && item) {
      if (editor.getHTML() !== item.content) {
        editor.commands.setContent(item.content || '');
      }
    }
  }, [item?.id, editor]);

  // Typewriter Mode: Scroll active line to vertical center on selection/keystroke
  useEffect(() => {
    if (!typewriterMode || !editor) return;

    const handleSelectionUpdate = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.top > 0) {
        window.scrollTo({
          top: window.scrollY + rect.top - window.innerHeight / 2,
          behavior: 'smooth',
        });
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [typewriterMode, editor]);

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950 p-8 text-center">
        <BookOpen className="w-16 h-16 mb-4 stroke-1 text-amber-500/40" />
        <h2 className="text-xl font-serif text-slate-300 mb-2">Ningún escrito seleccionado</h2>
        <p className="max-w-md text-sm text-slate-500">
          Selecciona o crea un capítulo, prólogo o escena en la barra lateral para comenzar a escribir la obra de Horus.
        </p>
      </div>
    );
  }

  // Theme styles for paper sheet
  const themePaperClasses = {
    dark: 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-black/80',
    light: 'bg-stone-50 border-stone-200 text-stone-900 shadow-xl shadow-stone-300/50',
    sepia: 'bg-[#f4ecd8] border-[#e2d5b7] text-[#3d3326] shadow-xl shadow-amber-900/10',
  }[theme];

  const fontClass = {
    lora: 'font-lora',
    merriweather: 'font-merriweather',
    playfair: 'font-playfair',
    inter: 'font-inter',
    'mono-code': 'font-mono-code',
  }[fontFamily];

  const wordCount = editor?.storage.characterCount.words() || 0;
  const charCount = editor?.storage.characterCount.characters() || 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={`flex-1 flex flex-col min-h-screen transition-colors duration-300 ${zenMode ? 'bg-slate-950' : 'bg-slate-950/90'}`}>
      
      {/* Zen Toggle Floating Button */}
      <button
        onClick={toggleZenMode}
        title={zenMode ? 'Salir del Modo Enfoque Zen (Esc)' : 'Activar Modo Enfoque Zen (Full Screen)'}
        className="fixed top-4 right-4 z-40 p-2.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/60 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
      >
        {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-12 flex justify-center">
        
        {/* Paper Sheet Component with Margins & Offset */}
        <div
          ref={editorRef}
          style={{
            maxWidth: `${paperWidth}px`,
            transform: `translateX(${paperMarginX}px)`,
          }}
          className={`w-full min-h-[85vh] rounded-xl border p-12 transition-all duration-200 ${themePaperClasses} ${fontClass}`}
        >
          {/* Header Title inside Paper */}
          <h1 className="text-3xl font-serif font-semibold border-b pb-4 mb-8 border-current/15 tracking-tight">
            {item.title}
          </h1>

          {/* TipTap Text Area */}
          <div style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Sub-bar Statistics */}
      {!zenMode && (
        <footer className="h-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur px-6 flex items-center justify-between text-xs text-slate-400 select-none">
          <div className="flex items-center gap-6">
            <span>
              <strong className="text-amber-400 font-mono">{wordCount}</strong> palabras
            </span>
            <span>
              <strong className="text-slate-300 font-mono">{charCount}</strong> caracteres
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> ~{readingTimeMinutes} min de lectura
            </span>
            {typewriterMode && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                Máquina de Escribir Activa
              </span>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};
