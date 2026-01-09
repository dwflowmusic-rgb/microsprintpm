import React, { useState, useEffect } from 'react';
import { MemoryCard, ProjectType, Status } from './types';
import { createNewMemoryCard, calculateCompletion, generateId } from './services/projectLogic';
import { 
  Save, Upload, Briefcase, Plus, UserCircle, 
  LayoutDashboard, CheckSquare, Settings, FileJson,
  AlertCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [memoryCard, setMemoryCard] = useState<MemoryCard | null>(null);
  const [view, setView] = useState<'dashboard' | 'sprints' | 'settings'>('dashboard');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<ProjectType>('software_development');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectOwner, setNewProjectOwner] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName) return;
    const newCard = createNewMemoryCard(newProjectName, newProjectType, newProjectDesc, newProjectOwner);
    setMemoryCard(newCard);
    setShowNewProjectModal(false);
  };

  const handleLoadMemoryCard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string) as MemoryCard;
          // Run calculation on load to ensure integrity
          const recalculated = calculateCompletion(json);
          setMemoryCard(recalculated);
        } catch (error) {
          alert('JSON do Memory Card Inválido');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveMemoryCard = () => {
    if (!memoryCard) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memoryCard, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const date = new Date().toISOString().split('T')[0];
    downloadAnchorNode.setAttribute("download", `project_${memoryCard.project.name.replace(/\s+/g, '_').toLowerCase()}_${date}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const updateCard = (newCard: MemoryCard) => {
    setMemoryCard(calculateCompletion(newCard));
  };

  const projectTypeMap: Record<ProjectType, string> = {
    software_development: 'Desenvolvimento de Software',
    legal_case: 'Caso Jurídico',
    mixed: 'Misto / Híbrido'
  };

  if (!memoryCard) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">MicroSprint PM</h1>
            <p className="text-slate-500 mt-2">Carregue um Memory Card ou inicie um novo projeto.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Novo Projeto
            </button>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".json" 
                onChange={handleLoadMemoryCard}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-600 rounded-lg font-medium transition flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Carregar Memory Card (.json)
              </button>
            </div>
          </div>
        </div>

        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Inicializar Projeto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Projeto</label>
                  <input 
                    type="text" 
                    value={newProjectName} 
                    onChange={e => setNewProjectName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="ex: Migração JurisdicLaw"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
                  <input 
                    type="text" 
                    value={newProjectOwner} 
                    onChange={e => setNewProjectOwner(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select 
                    value={newProjectType} 
                    onChange={e => setNewProjectType(e.target.value as ProjectType)}
                    className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                  >
                    <option value="software_development">Desenvolvimento de Software</option>
                    <option value="legal_case">Caso Jurídico</option>
                    <option value="mixed">Misto / Híbrido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                  <textarea 
                    value={newProjectDesc} 
                    onChange={e => setNewProjectDesc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 h-24 resize-none outline-none"
                    placeholder="Objetivo breve..."
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                  <button onClick={handleCreateProject} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Criar Projeto</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const persona = memoryCard.personas[memoryCard.project.active_persona];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">MicroSprint</span>
          </div>
          <div className="text-xs text-slate-500 truncate">{memoryCard.project.name}</div>
        </div>

        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setView('sprints')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${view === 'sprints' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800'}`}
          >
            <CheckSquare className="w-5 h-5" />
            Sprints & Tarefas
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Persona Ativa</div>
          <button 
            onClick={() => {
                const newPersona = memoryCard.project.active_persona === 'software_engineer' ? 'lawyer' : 'software_engineer';
                updateCard({ ...memoryCard, project: { ...memoryCard.project, active_persona: newPersona } });
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center gap-3 transition group"
          >
            <div className={`p-2 rounded-full ${memoryCard.project.active_persona === 'software_engineer' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-sm font-medium text-white truncate group-hover:text-blue-200 transition">{persona.name}</div>
              <div className="text-xs text-slate-500 truncate">Clique para alternar</div>
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSaveMemoryCard}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-green-600 text-slate-300 hover:text-white rounded-lg transition text-sm"
          >
            <Save className="w-4 h-4" />
            Salvar Memory Card
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {view === 'dashboard' && 'Visão Geral do Dashboard'}
              {view === 'sprints' && 'Gerenciamento de Sprints'}
              {view === 'settings' && 'Configurações do Projeto'}
            </h2>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                persona.id === 'software_engineer' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Visão {persona.name}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{projectTypeMap[memoryCard.project.type]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-slate-400">ID do Projeto</span>
                <span className="text-xs font-mono text-slate-600">{memoryCard.project.id.split('_').pop()}</span>
             </div>
          </div>
        </header>

        <div className="p-6">
          <Dashboard 
            memoryCard={memoryCard} 
            updateCard={updateCard} 
            viewMode={view}
          />
        </div>
      </main>
    </div>
  );
};

export default App;