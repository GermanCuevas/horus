# Reglas de Arquitectura de Horus: Almacenamiento Local y Prioridad Offline

## Directrices de Almacenamiento de Datos
- **Cero Base de Datos en Servidor Externo**: Todos los datos de usuario, manuscritos, capítulos y fichas de personajes residen estrictamente en el dispositivo cliente del usuario.
- **IndexedDB vía Dexie.js**: Utilizar Dexie.js para guardado automático ultra rápido, consultas reactivas y almacenamiento offline de todos los elementos del manuscrito.
- **API de Acceso al Sistema de Archivos (File System Access API)**: Soporte para lectura y escritura directa de paquetes de proyecto `.horus`, archivos Markdown (`.md`) y exportaciones (EPUB, PDF, DOCX) directamente en el sistema de archivos local del usuario.
- **Seguridad de Datos y Guardado Automático**: Implementar guardado automático continuo en segundo plano con temporizador (debounce, ej. 500ms tras la última pulsación de tecla) para garantizar cero pérdida de datos.
