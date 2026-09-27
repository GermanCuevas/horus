import { create } from 'zustand';

export type FontOption = 'lora' | 'merriweather' | 'playfair' | 'inter' | 'mono-code';
export type ThemeOption = 'dark' | 'light' | 'sepia';

interface WritingStore {
  // Active Project & Document
  activeProjectId: number | null;
  activeItemId: number | null;
  setActiveProjectId: (id: number | null) => void;
  setActiveItemId: (id: number | null) => void;

  // Editor Settings
  fontFamily: FontOption;
  fontSize: number; // in px
  lineHeight: number; // e.g. 1.8
  paperWidth: number; // max-w in px (e.g. 720)
  paperMarginX: number; // Horizontal offset in px ("correr la hoja")
  theme: ThemeOption;
  zenMode: boolean;
  typewriterMode: boolean;
  sidebarOpen: boolean;

  // Actions
  setFontFamily: (font: FontOption) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setPaperWidth: (width: number) => void;
  setPaperMarginX: (margin: number) => void;
  setTheme: (theme: ThemeOption) => void;
  toggleZenMode: () => void;
  toggleTypewriterMode: () => void;
  toggleSidebar: () => void;
}

export const useWritingStore = create<WritingStore>((set) => ({
  activeProjectId: null,
  activeItemId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setActiveItemId: (id) => set({ activeItemId: id }),

  fontFamily: 'lora',
  fontSize: 19,
  lineHeight: 1.8,
  paperWidth: 760,
  paperMarginX: 0,
  theme: 'dark',
  zenMode: false,
  typewriterMode: false,
  sidebarOpen: true,

  setFontFamily: (font) => set({ fontFamily: font }),
  setFontSize: (size) => set({ fontSize: size }),
  setLineHeight: (height) => set({ lineHeight: height }),
  setPaperWidth: (width) => set({ paperWidth: width }),
  setPaperMarginX: (margin) => set({ paperMarginX: margin }),
  setTheme: (theme) => set({ theme: theme }),
  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode, sidebarOpen: state.zenMode })),
  toggleTypewriterMode: () => set((state) => ({ typewriterMode: !state.typewriterMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
