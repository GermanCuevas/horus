import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type ManuscriptItem, type Project } from '../db/database';
import { useWritingStore } from '../store/useWritingStore';
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  Users,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  onOpenCharacterModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeProjectId, activeItemId, setActiveProjectId, setActiveItemId, sidebarOpen, zenMode } =
    useWritingStore();

  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'manuscript' | 'worldbuilding'>('manuscript');

  // Query projects and items reactively from Dexie
  const projects = useLiveQuery<Project[]>(() => db.projects.toArray(), []) || [];
  
  const items = useLiveQuery<ManuscriptItem[]>(
    () =>
      activeProjectId
        ? db.items.where('projectId').equals(activeProjectId).sortBy('order')
        : Promise.resolve([]),
    [activeProjectId]
  ) || [];

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Auto select first project if available
  React.useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id!);
    }
  }, [projects, activeProjectId]);

  // Auto select first item if available
  React.useEffect(() => {
    if (items.length > 0 && !activeItemId) {
      setActiveItemId(items[0].id!);
    }
  }, [items, activeItemId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const projectId = await db.projects.add({
      title: newProjectTitle.trim(),
      author: 'Autor',
      genre: 'Novela',
      summary: '',
      dailyGoal: 500,
      totalGoal: 50000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create default structure for the new project
    const ch1Id = await db.items.add({
      projectId: projectId as number,
      type: 'chapter',
      title: 'Capítulo 1: El Comienzo',
      content: '<h2>Capítulo 1</h2><p>Las primeras líneas de una gran historia...</p>',
      wordCount: 8,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setNewProjectTitle('');
    setShowNewProjectInput(false);
    setActiveProjectId(projectId as number);
    setActiveItemId(ch1Id as number);
  };

  const handleCreateItem = async (type: ManuscriptItem['type']) => {
    if (!activeProjectId) return;
    const maxOrder = items.reduce((max, item) => Math.max(max, item.order), 0);
    const defaultTitle =
      type === 'chapter'
        ? `Capítulo ${items.filter((i) => i.type === 'chapter').length + 1}`
        : type === 'scene'
        ? 'Nueva Escena'
        : type === 'character'
        ? 'Nuevo Personaje'
        : 'Nueva Nota';

    const id = await db.items.add({
      projectId: activeProjectId,
      type,
      title: defaultTitle,
      content: `<p>Contenido de ${defaultTitle}...</p>`,
      wordCount: 4,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setActiveItemId(id as number);
  };

  const handleDeleteItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Deseas eliminar este elemento?')) {
      await db.items.delete(id);
      if (activeItemId === id) {
        const remaining = items.filter((i) => i.id !== id);
        setActiveItemId(remaining.length > 0 ? remaining[0].id! : null);
      }
    }
  };

  if (!sidebarOpen || zenMode) return null;

  const manuscriptItems = items.filter((i) => ['prologue', 'chapter', 'scene', 'epilogue'].includes(i.type));
  const worldbuildingItems = items.filter((i) => ['character', 'note'].includes(i.type));

  const totalWords = items.reduce((acc, i) => acc + (i.wordCount || 0), 0);

  return (
    <aside className="w-72 border-r border-[var(--border)] bg-[var(--bg-sidebar)] flex flex-col h-[calc(100vh-3.5rem)] text-[var(--text-primary)] select-none transition-colors duration-200">
      
      {/* Project Selector Header */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-app)]/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-ui-s font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Obra Activa
          </span>
          <button
            onClick={() => setShowNewProjectInput(!showNewProjectInput)}
            className="p-1 rounded text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
            title="Crear Nueva Obra"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showNewProjectInput ? (
          <form onSubmit={handleCreateProject} className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Título de la obra..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded px-2 py-1 text-ui-s text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 bg-[var(--bg-surface-active)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] rounded text-ui-s font-medium border border-[var(--border)]"
            >
              Crear
            </button>
          </form>
        ) : (
          <select
            value={activeProjectId || ''}
            onChange={(e) => setActiveProjectId(Number(e.target.value))}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-ui-m text-[var(--text-primary)] font-serif focus:outline-none cursor-pointer"
          >
            {projects.length === 0 && <option value="">No hay obras aún</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                📖 {p.title}
              </option>
            ))}
          </select>
        )}

        {/* Total Project Stats */}
        {activeProject && (
          <div className="mt-3 flex items-center justify-between text-ui-s text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-md px-2.5 py-1.5 border border-[var(--border)]">
            <span>Total Obra:</span>
            <span className="font-mono text-[var(--text-primary)] font-medium">{totalWords.toLocaleString()} palabras</span>
          </div>
        )}
      </div>

      {/* Tabs: Manuscrito vs Worldbuilding */}
      <div className="flex border-b border-[var(--border)] bg-[var(--bg-app)]/20 text-ui-s">
        <button
          onClick={() => setActiveTab('manuscript')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition border-b-2 ${
            activeTab === 'manuscript'
              ? 'border-[var(--text-primary)] text-[var(--text-primary)] bg-[var(--bg-surface)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manuscrito</span>
        </button>
        <button
          onClick={() => setActiveTab('worldbuilding')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition border-b-2 ${
            activeTab === 'worldbuilding'
              ? 'border-[var(--text-primary)] text-[var(--text-primary)] bg-[var(--bg-surface)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Fichas & Notas</span>
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {activeTab === 'manuscript' && (
          <>
            <div className="flex items-center justify-between text-ui-s text-[var(--text-secondary)] px-2 py-1">
              <span className="font-medium">Estructura del Libro</span>
              <button
                onClick={() => handleCreateItem('chapter')}
                className="flex items-center gap-1 text-ui-s text-[var(--text-primary)] hover:underline"
              >
                <Plus className="w-3 h-3" /> Capítulo
              </button>
            </div>

            {manuscriptItems.length === 0 ? (
              <p className="text-ui-s text-[var(--text-muted)] italic p-3 text-center">Sin capítulos aún.</p>
            ) : (
              manuscriptItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItemId(item.id!)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-ui-m cursor-pointer transition ${
                    activeItemId === item.id
                      ? 'bg-[var(--bg-surface-active)] text-[var(--text-active)] border border-[var(--border)] font-medium shadow-xs'
                      : 'hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
                    <span className="font-mono text-ui-s text-[var(--text-muted)]">{item.wordCount || 0}w</span>
                    <button
                      onClick={(e) => handleDeleteItem(item.id!, e)}
                      className="text-[var(--text-muted)] hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'worldbuilding' && (
          <>
            <div className="flex items-center justify-between text-ui-s text-[var(--text-secondary)] px-2 py-1">
              <span className="font-medium">Personajes y Notas</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateItem('character')}
                  className="text-ui-s text-[var(--text-primary)] hover:underline"
                >
                  + Personaje
                </button>
                <button
                  onClick={() => handleCreateItem('note')}
                  className="text-ui-s text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  + Nota
                </button>
              </div>
            </div>

            {worldbuildingItems.length === 0 ? (
              <p className="text-ui-s text-[var(--text-muted)] italic p-3 text-center">No hay personajes ni notas aún.</p>
            ) : (
              worldbuildingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItemId(item.id!)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-ui-m cursor-pointer transition ${
                    activeItemId === item.id
                      ? 'bg-[var(--bg-surface-active)] text-[var(--text-active)] border border-[var(--border)] font-medium shadow-xs'
                      : 'hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.type === 'character' ? (
                      <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteItem(item.id!, e)}
                    className="text-[var(--text-muted)] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </aside>
  );
};
