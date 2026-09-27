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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-serif font-semibold text-slate-100 mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-amber-400" />
          Exportar Obra Localmente
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Guarda tus manuscritos directamente en tu equipo sin intermediarios ni bases de datos en la nube.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleExportHorusJson}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-800 hover:border-amber-500/50 transition group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-100">Paquete de Proyecto (.horus / JSON)</h4>
                <p className="text-xs text-slate-400">Guarda todo el manuscrito, fichas y notas para reimportar.</p>
              </div>
            </div>
            <Check className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
          </button>

          <button
            onClick={handleExportMarkdown}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-800 hover:border-amber-500/50 transition group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-100">Manuscrito Unificado (.md)</h4>
                <p className="text-xs text-slate-400">Formato Markdown limpio listo para publicar o editar.</p>
              </div>
            </div>
            <Check className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
