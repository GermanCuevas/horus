# Reglas del Sistema de Diseño y Paleta de Colores de Horus

## Mandato Estricto del Sistema de Colores
TODOS los componentes de UI en Horus DEBEN consumir exclusivamente los tokens de diseño CSS definidos en `src/index.css`.
NUNCA escribas colores de fondo o texto fijos (como `bg-red-500` o `bg-slate-900`) directamente en JSX salvo que referencies variables del sistema de diseño.

## Tokens de Tema y Variables CSS
- `--bg-app`: Fondo principal de la aplicación detrás del papel y la barra lateral.
- `--bg-surface`: Fondo de la barra lateral de navegación, modales y barra de herramientas.
- `--bg-surface-hover`: Estado al pasar el cursor (hover) para botones, elementos de lista e insumos.
- `--bg-paper`: Lienzo de hoja de papel física para escribir.
- `--text-primary`: Texto principal del cuerpo y encabezados (alta legibilidad, baja fatiga visual).
- `--text-secondary`: Subtítulos, metadatos y etiquetas activas.
- `--text-muted`: Textos de relleno (placeholders), contadores de caracteres e íconos inactivos.
- `--accent`: Color de acento ámbar principal de la marca para elementos activos en Horus.
- `--accent-soft`: Resaltado de fondo para selecciones activas.
- `--border`: Bordes sutiles, divisores y contornos de paneles.

## Especificaciones de Paleta
- **Modo Oscuro**: Pizarra de Carbón Suave (`#13151a`), no negro puro, diseñado para largas sesiones de escritura nocturna.
- **Modo Claro**: Gris Suave para Confort Visual (`#f3f4f6`), base de gris atenuado con papel blanco nítido (`#ffffff`).

## Escala Semántica de Tipografía (Uso Obligatorio)
Utiliza las variables CSS y clases utilitarias definidas en `src/index.css` en lugar de clases de tamaño arbitrarias:
- **UI / Interfaz**:
  - `text-ui-s` (`--fs-ui-s` = 12px): Etiquetas específicas, aclaraciones, metadatos, tooltips.
  - `text-ui-m` (`--fs-ui-m` = 14px): Texto estándar de UI, ítems de la barra lateral, botones.
  - `text-ui-l` (`--fs-ui-l` = 16px): Navegación principal en sidebar, títulos de sección en UI, botones clave.
- **Escritura / Lienzo**:
  - `text-writing-s` (`--fs-writing-s` = 17px): Lectura compacta.
  - `text-writing-m` (`--fs-writing-m` = 19px): Lectura estándar por defecto en la hoja de papel.
  - `text-writing-l` (`--fs-writing-l` = 22px): Lectura amplia.
- **Display / Titulares Grandes**:
  - `text-display-m` (`--fs-display-m` = 28px): Títulos de modales o vistas principales.
  - `text-display-l` (`--fs-display-l` = 36px): Título principal del nombre de la App / Home.
