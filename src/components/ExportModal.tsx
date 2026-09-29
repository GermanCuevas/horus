import React from 'react';
import { db } from '../db/database';
import { Download, FileCode, FileText, X, Check } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectId: number | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, activeProjectId }) => {
  if (!isOpen || !activeProjectId) return null;

  const project = useLiveQuery(() => db.projects.get(activeProjectId), [activeProjectId]);
  const items = useLiveQuery(
    () => db.items.where('projectId').equals(activeProjectId).sortBy('order'),
    [activeProjectId]
  ) || [];

  const handleExportHorusJson = () => {
    if (!project) return;
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project,
      items,
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_horus_project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!project) return;
    let mdContent = `# ${project.title}\n\n*Autor: ${project.author}*\n\n---\n\n`;

    items.forEach((item) => {
      mdContent += `## ${item.title}\n\n`;
      // Convert basic HTML to plain text paragraph lines
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.content || '';
      mdContent += `${tempDiv.textContent || tempDiv.innerText}\n\n---\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_manuscrito.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 text-[var(--text-primary)] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-ui-l font-serif font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-[var(--text-primary)]" />
          Exportar Obra Localmente
        </h3>
        <p className="text-ui-s text-[var(--text-secondary)] mb-6">
          Guarda tus manuscritos directamente en tu equipo sin intermediarios ni bases de datos en la nube.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleExportHorusJson}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border)] hover:border-[var(--text-primary)]/50 transition group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface-active)] text-[var(--text-primary)]">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-ui-m font-medium text-[var(--text-primary)]">Paquete de Proyecto (.horus / JSON)</h4>
                <p className="text-ui-s text-[var(--text-secondary)]">Guarda todo el manuscrito, fichas y notas para reimportar.</p>
              </div>
            </div>
            <Check className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
          </button>

          <button
            onClick={handleExportMarkdown}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border)] hover:border-[var(--text-primary)]/50 transition group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface-active)] text-[var(--text-primary)]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-ui-m font-medium text-[var(--text-primary)]">Manuscrito Unificado (.md)</h4>
                <p className="text-ui-s text-[var(--text-secondary)]">Formato Markdown limpio listo para publicar o editar.</p>
              </div>
            </div>
            <Check className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
          </button>
        </div>
      </div>
    </div>
  );
};
