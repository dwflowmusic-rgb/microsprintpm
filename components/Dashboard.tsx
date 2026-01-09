import React, { useState } from 'react';
import { MemoryCard, Sprint, MicroSprint, Task, Status, INITIAL_PERSONAS } from '../types'; // Adjust path if needed.
import { generateId as genId } from '../services/projectLogic';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, AlertTriangle, 
  Clock, Calendar, ArrowRight, Trash2, FileText, Scale
} from 'lucide-react';

interface Props {
  memoryCard: MemoryCard;
  updateCard: (card: MemoryCard) => void;
  viewMode: 'dashboard' | 'sprints' | 'settings';
}

const ProgressBar = ({ percent, colorClass = "bg-blue-600" }: { percent: number, colorClass?: string }) => (
  <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 overflow-hidden">
    <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
  </div>
);

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    pending: 'bg-slate-100 text-slate-600',
    blocked: 'bg-red-100 text-red-800'
  };
  const labels = {
    completed: 'CONCLUÍDO',
    in_progress: 'EM ANDAMENTO',
    pending: 'PENDENTE',
    blocked: 'BLOQUEADO'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const Dashboard: React.FC<Props> = ({ memoryCard, updateCard, viewMode }) => {
  const [expandedSprint, setExpandedSprint] = useState<string | null>(memoryCard.project.current_sprint || null);
  const [expandedMicro, setExpandedMicro] = useState<string | null>(null);

  // New Sprint/MicroSprint/Task State
  const [newSprintName, setNewSprintName] = useState('');
  const [newMicroName, setNewMicroName] = useState('');
  const [newMicroWeight, setNewMicroWeight] = useState(0.5);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskEst, setNewTaskEst] = useState(1);

  const activePersona = memoryCard.personas[memoryCard.project.active_persona];

  // -- Actions --

  const addSprint = () => {
    if (!newSprintName) return;
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const newSprint: Sprint = {
      id: genId('sprint'),
      name: newSprintName,
      description: '',
      status: 'pending',
      start_date: today.toISOString().split('T')[0],
      planned_end_date: nextWeek.toISOString().split('T')[0],
      planned_duration_days: 7,
      completion_percentage: 0,
      micro_sprints: [],
      sprint_summary: {
        total_micro_sprints: 0, completed_micro_sprints: 0, total_tasks: 0, completed_tasks: 0,
        total_estimated_hours: 0, total_actual_hours: 0, efficiency_ratio: 0, velocity: 0
      }
    };
    updateCard({ ...memoryCard, sprints: [...memoryCard.sprints, newSprint] });
    setNewSprintName('');
  };

  const addMicroSprint = (sprintId: string) => {
    if (!newMicroName) return;
    const updatedSprints = memoryCard.sprints.map(s => {
      if (s.id === sprintId) {
        return {
          ...s,
          micro_sprints: [...s.micro_sprints, {
            id: genId('ms'),
            name: newMicroName,
            description: '',
            status: 'pending' as Status,
            weight_in_sprint: Number(newMicroWeight),
            estimated_hours: 0,
            actual_hours: 0,
            completion_percentage: 0,
            tasks: [],
            persona_analysis: {},
            custom_annotations: []
          }]
        };
      }
      return s;
    });
    updateCard({ ...memoryCard, sprints: updatedSprints });
    setNewMicroName('');
  };

  const addTask = (sprintId: string, microId: string) => {
    if (!newTaskDesc) return;
    const updatedSprints = memoryCard.sprints.map(s => {
      if (s.id === sprintId) {
        return {
          ...s,
          micro_sprints: s.micro_sprints.map(ms => {
            if (ms.id === microId) {
              return {
                ...ms,
                tasks: [...ms.tasks, {
                  id: genId('task'),
                  description: newTaskDesc,
                  status: 'pending' as Status,
                  estimated_hours: Number(newTaskEst),
                  actual_hours: 0
                }]
              };
            }
            return ms;
          })
        };
      }
      return s;
    });
    updateCard({ ...memoryCard, sprints: updatedSprints });
    setNewTaskDesc('');
  };

  const toggleTaskStatus = (sprintId: string, microId: string, taskId: string, currentStatus: Status) => {
    const updatedSprints = memoryCard.sprints.map(s => {
      if (s.id === sprintId) {
        return {
          ...s,
          micro_sprints: s.micro_sprints.map(ms => {
            if (ms.id === microId) {
              return {
                ...ms,
                tasks: ms.tasks.map(t => {
                  if (t.id === taskId) {
                    const newStatus: Status = currentStatus === 'completed' ? 'pending' : 'completed';
                    // Simple prompt for actual hours if completing
                    let actual = t.actual_hours;
                    if (newStatus === 'completed' && t.actual_hours === 0) {
                       // In a real app, a modal. Here, assume estimate.
                       actual = t.estimated_hours; 
                    }
                    return { ...t, status: newStatus, actual_hours: actual };
                  }
                  return t;
                })
              };
            }
            return ms;
          })
        };
      }
      return s;
    });
    updateCard({ ...memoryCard, sprints: updatedSprints });
  };

  // -- Views --

  const renderMacroDashboard = () => {
    const macro = memoryCard.performance_analytics.macro_analysis;
    const chartData = memoryCard.sprints.map(s => ({
      name: s.name,
      completed: s.sprint_summary.completed_tasks,
      total: s.sprint_summary.total_tasks
    }));

    return (
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="text-slate-500 text-sm font-medium mb-1">Progresso Geral</div>
            <div className="text-3xl font-bold text-slate-800">{macro.overall_project_completion}%</div>
            <div className="mt-2"><ProgressBar percent={macro.overall_project_completion} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-medium mb-1">Velocidade Atual</div>
             <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{macro.average_velocity}</span>
                <span className="text-xs text-slate-400">tarefas/sprint</span>
             </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-medium mb-1">Taxa de Eficiência</div>
             <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${macro.average_sprint_efficiency > 1.1 ? 'text-red-500' : 'text-green-600'}`}>
                  {macro.average_sprint_efficiency.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">Real / Est.</span>
             </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm font-medium mb-1">Est. de Conclusão</div>
             <div className="text-lg font-bold text-slate-800">{macro.estimated_completion_date || "N/D"}</div>
             <div className="text-xs text-slate-400 mt-1">Baseado na velocidade histórica</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4">Desempenho dos Sprints</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ReTooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total de Tarefas" />
                  <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tarefas Concluídas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Persona Insights */}
          <div className={`p-6 rounded-xl shadow-sm border ${
              activePersona.id === 'software_engineer' ? 'bg-purple-50 border-purple-100' : 'bg-emerald-50 border-emerald-100'
            }`}>
            <div className="flex items-center gap-2 mb-4">
              {activePersona.id === 'software_engineer' ? <FileText className="text-purple-600"/> : <Scale className="text-emerald-600"/>}
              <h3 className={`font-bold ${activePersona.id === 'software_engineer' ? 'text-purple-800' : 'text-emerald-800'}`}>
                Insights: {activePersona.name}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Áreas de Foco</div>
                <div className="flex flex-wrap gap-1">
                  {activePersona.focus_areas.map(area => (
                    <span key={area} className="px-2 py-1 bg-white/60 rounded text-xs font-medium border border-black/5">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">Prioridade de Métricas</div>
                <ul className="space-y-2">
                  {activePersona.metrics_priority.map(metric => (
                     <li key={metric} className="flex justify-between items-center text-sm">
                       <span>{metric}</span>
                       <span className="font-mono font-bold">--</span>
                     </li>
                  ))}
                </ul>
              </div>

              {activePersona.id === 'software_engineer' && (
                <div className="bg-white/50 p-3 rounded-lg text-sm text-purple-900 mt-4">
                  <span className="font-semibold">Recomendação:</span> Alta complexidade no Sprint 2 requer atenção à cobertura de testes unitários.
                </div>
              )}
               {activePersona.id === 'lawyer' && (
                <div className="bg-white/50 p-3 rounded-lg text-sm text-emerald-900 mt-4">
                   <span className="font-semibold">Alerta de Conformidade:</span> Garanta que a documentação LGPD para dados de usuários no Sprint 2 esteja finalizada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSprintsView = () => (
    <div className="space-y-6">
      {memoryCard.sprints.map((sprint) => (
        <div key={sprint.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Sprint Header */}
          <div 
            className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
            onClick={() => setExpandedSprint(expandedSprint === sprint.id ? null : sprint.id)}
          >
             <div className="flex items-center gap-4">
                <div className={`transition-transform duration-200 ${expandedSprint === sprint.id ? 'rotate-90' : ''}`}>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     {sprint.name} 
                     <StatusBadge status={sprint.status} />
                   </h3>
                   <div className="text-xs text-slate-500 mt-0.5 flex gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {sprint.start_date} - {sprint.planned_end_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {sprint.sprint_summary.total_actual_hours}h / {sprint.sprint_summary.total_estimated_hours}h</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4 w-1/3">
               <div className="flex-1">
                 <div className="flex justify-between text-xs mb-1">
                    <span>Progresso</span>
                    <span>{sprint.completion_percentage.toFixed(0)}%</span>
                 </div>
                 <ProgressBar percent={sprint.completion_percentage} />
               </div>
             </div>
          </div>

          {/* Sprint Body */}
          {expandedSprint === sprint.id && (
            <div className="p-4 border-t border-slate-200 bg-white">
               
               {/* Micro Sprints List */}
               <div className="space-y-4">
                  {sprint.micro_sprints.map(ms => (
                    <div key={ms.id} className="border border-slate-200 rounded-lg">
                       <div 
                         className="p-3 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                         onClick={() => setExpandedMicro(expandedMicro === ms.id ? null : ms.id)}
                       >
                          <div className="flex items-center gap-3">
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedMicro === ms.id ? 'rotate-180' : ''}`} />
                            <span className="font-medium text-slate-700">{ms.name}</span>
                            <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Peso: {ms.weight_in_sprint}</span>
                            {ms.completion_percentage === 100 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          <div className="w-24">
                             <ProgressBar percent={ms.completion_percentage} colorClass="bg-indigo-500" />
                          </div>
                       </div>

                       {expandedMicro === ms.id && (
                         <div className="p-3 bg-slate-50 border-t border-slate-200">
                           {/* Tasks */}
                           <ul className="space-y-2 mb-3">
                             {ms.tasks.map(task => (
                               <li key={task.id} className="flex items-start gap-3 p-2 bg-white rounded border border-slate-200 hover:border-blue-300 transition group">
                                  <button 
                                    onClick={() => toggleTaskStatus(sprint.id, ms.id, task.id, task.status)}
                                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition ${
                                      task.status === 'completed' 
                                      ? 'bg-green-500 border-green-500 text-white' 
                                      : 'border-slate-300 text-transparent hover:border-blue-500'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="flex-1">
                                    <div className={`text-sm ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                      {task.description}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 flex gap-2">
                                       <span>Est: {task.estimated_hours}h</span>
                                       {task.actual_hours > 0 && <span>Real: {task.actual_hours}h</span>}
                                    </div>
                                  </div>
                                  {activePersona.id === 'software_engineer' && (
                                    <div className="opacity-0 group-hover:opacity-100 transition">
                                      {/* Placeholder for tech notes action */}
                                    </div>
                                  )}
                               </li>
                             ))}
                             {ms.tasks.length === 0 && <div className="text-sm text-slate-400 italic px-2">Nenhuma tarefa ainda.</div>}
                           </ul>

                           {/* Add Task Input */}
                           <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="Nova tarefa..." 
                                className="flex-1 text-sm border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                                value={newTaskDesc}
                                onChange={e => setNewTaskDesc(e.target.value)}
                              />
                              <input 
                                type="number" 
                                placeholder="Hrs" 
                                className="w-16 text-sm border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                                value={newTaskEst}
                                onChange={e => setNewTaskEst(Number(e.target.value))}
                              />
                              <button 
                                onClick={() => addTask(sprint.id, ms.id)}
                                className="bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-600 rounded px-2 py-1 text-sm transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                           </div>
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               {/* Add Micro Sprint */}
               <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2 items-center">
                 <span className="text-sm font-medium text-slate-600">Novo Micro Sprint:</span>
                 <input 
                    type="text" 
                    placeholder="Nome (ex: Configuração Backend)" 
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                    value={newMicroName}
                    onChange={e => setNewMicroName(e.target.value)}
                 />
                 <select 
                   className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none"
                   value={newMicroWeight}
                   onChange={e => setNewMicroWeight(Number(e.target.value))}
                 >
                   <option value={0.1}>10%</option>
                   <option value={0.25}>25%</option>
                   <option value={0.5}>50%</option>
                   <option value={1.0}>100%</option>
                 </select>
                 <button 
                   onClick={() => addMicroSprint(sprint.id)}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                 >
                   Adicionar
                 </button>
               </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Create Sprint */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
         <h3 className="text-slate-500 font-medium mb-4">Planejar Próximo Sprint</h3>
         <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="text" 
              placeholder="Nome do Sprint" 
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={newSprintName}
              onChange={e => setNewSprintName(e.target.value)}
            />
            <button 
              onClick={addSprint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Criar Sprint
            </button>
         </div>
      </div>
    </div>
  );

  return viewMode === 'dashboard' ? renderMacroDashboard() : renderSprintsView();
};

export default Dashboard;