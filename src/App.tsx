import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type ManuscriptItem } from './db/database';
import { useWritingStore } from './store/useWritingStore';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { ExportModal } from './components/ExportModal';

export function App() {
  const { activeProjectId, activeItemId, theme, setActiveProjectId, setActiveItemId } = useWritingStore();
  const [exportOpen, setExportOpen] = useState(false);

  // Sync theme with document root attribute [data-theme]
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Seed default demo project on first application launch
  useEffect(() => {
    const initSeed = async () => {
      const count = await db.projects.count();
      if (count === 0) {
        const projectId = await db.projects.add({
          title: 'El Ojo de Horus',
          author: 'Escritor',
          genre: 'Fantasía / Misterio',
          summary: 'Una novela sobre antiguos manuscritos y la búsqueda de la verdad.',
          dailyGoal: 500,
          totalGoal: 60000,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const ch1Id = await db.items.add({
          projectId: projectId as number,
          type: 'chapter',
          title: 'Capítulo I: El Primer Escriba',
          content: `<h2>Capítulo I: El Primer Escriba</h2>
<p>La tinta sobre el papiro aún estaba fresca cuando el viejo sabio alzó la vista hacia el horizonte desértico. El viento traía consigo los susurros de historias aún no escritas.</p>
<p>En el estudio de escritura de Horus, cada palabra cuenta un destino. Escribe con libertad, ajusta la tipografía a tu gusto y deja que las ideas fluyan en el papel digital sin distracciones.</p>`,
          wordCount: 65,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await db.items.add({
          projectId: projectId as number,
          type: 'chapter',
          title: 'Capítulo II: La Hoja en Blanco',
          content: `<h2>Capítulo II: La Hoja en Blanco</h2>
<p>Frente a la hoja vacía, el autor desplaza el papel hacia el centro, ajusta el interlineado y activa el modo máquina de escribir. Las palabras surgen solas...</p>`,
          wordCount: 30,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await db.items.add({
          projectId: projectId as number,
          type: 'character',
          title: 'Personaje: Amón',
          content: `<h3>Amón - Escriba Real</h3>
<p><strong>Rol:</strong> Protagonista principal.</p>
<p><strong>Personalidad:</strong> Observador, meticuloso y perspicaz.</p>`,
          wordCount: 15,
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        setActiveProjectId(projectId as number);
        setActiveItemId(ch1Id as number);
      }
    };

    initSeed();
  }, []);

  // Fetch current active manuscript item from IndexedDB
  const activeItem = useLiveQuery<ManuscriptItem | null>(
    () => (activeItemId ? db.items.get(activeItemId).then((res) => res || null) : Promise.resolve(null)),
    [activeItemId]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] transition-colors duration-250">
      
      {/* Top Controls Toolbar */}
      <Toolbar onOpenExport={() => setExportOpen(true)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onOpenCharacterModal={() => {}} />
        <Editor item={activeItem || null} />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        activeProjectId={activeProjectId}
      />
    </div>
  );
}

export default App;
