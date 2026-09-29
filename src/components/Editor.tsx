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
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-app)] p-8 text-center">
        <BookOpen className="w-16 h-16 mb-4 stroke-1 text-[var(--text-secondary)]/40" />
        <h2 className="text-display-m font-serif text-[var(--text-primary)] mb-2">Ningún escrito seleccionado</h2>
        <p className="max-w-md text-ui-m text-[var(--text-secondary)]">
          Selecciona o crea un capítulo, prólogo o escena en la barra lateral para comenzar a escribir la obra de Horus.
        </p>
      </div>
    );
  }

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
    <div className={`flex-1 flex flex-col min-h-screen transition-colors duration-250 bg-[var(--bg-app)]`}>
      
      {/* Zen Toggle Floating Button */}
      <button
        onClick={toggleZenMode}
        title={zenMode ? 'Salir del Modo Enfoque Zen (Esc)' : 'Activar Modo Enfoque Zen (Full Screen)'}
        className="fixed top-4 right-4 z-40 p-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition shadow-lg"
      >
        {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-12 flex justify-center">
        
        {/* Paper Sheet Component with Margins, Ruled Lines & Offset */}
        <div
          ref={editorRef}
          style={{
            maxWidth: `${paperWidth}px`,
            transform: `translateX(${paperMarginX}px)`,
            boxShadow: 'var(--paper-shadow)',
          }}
          className={`w-full min-h-[85vh] rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] paper-ruled text-[var(--text-primary)] p-12 transition-all duration-200 ${fontClass}`}
        >
          {/* Header Title inside Paper */}
          <h1 className="text-display-m font-serif font-semibold border-b pb-4 mb-8 border-current/15 tracking-tight">
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
        <footer className="h-10 border-t border-[var(--border)] bg-[var(--bg-surface)] px-6 flex items-center justify-between text-ui-s text-[var(--text-secondary)] select-none transition-colors duration-200">
          <div className="flex items-center gap-6">
            <span>
              <strong className="text-[var(--text-primary)] font-mono">{wordCount}</strong> palabras
            </span>
            <span>
              <strong className="text-[var(--text-primary)] font-mono">{charCount}</strong> caracteres
            </span>
          </div>

          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" /> ~{readingTimeMinutes} min de lectura
            </span>
            {typewriterMode && (
              <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-active)] text-[var(--text-primary)] border border-[var(--border)] text-ui-s">
                Máquina de Escribir Activa
              </span>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};
