# Arquitectura Frontend y Guías Técnicas de Horus

## Stack Tecnológico
- **Framework**: React 19 + Vite + TypeScript.
- **Estilos**: Tailwind CSS + Variables HSL personalizadas para temas oscuro/claro/sepia.
- **Editor**: TipTap (ProseMirror) con extensiones personalizadas.
- **Gestión de Estado**: Zustand para el estado de la UI (modo enfoque, visibilidad de la barra lateral, tema, ajustes tipográficos) y hooks de Dexie para datos reactivos del manuscrito.
- **Iconografía**: Lucide React.

## Estándares de Calidad
- Sin elementos de UI temporales o marcadores de posición; proporcionar componentes totalmente interactivos.
- Estética glassmorphism / pizarra oscura limpia y responsiva.
- Atajos de teclado para acciones comunes (Ctrl+S, Ctrl+Shift+F para modo Zen, Ctrl+B/I).
