import React, { useState } from 'react';
import { MemoryCard, ProjectType, PersonaType, INITIAL_PERSONAS } from '../types';
import { generateProjectFromDocs } from '../services/aiService';
import { Upload, FileText, X, Loader2, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  onCancel: () => void;
  onProjectCreated: (card: MemoryCard) => void;
}

const AIProjectWizard: React.FC<Props> = ({ onCancel, onProjectCreated }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [projectType, setProjectType] = useState<ProjectType>('software_development');
  const [persona, setPersona] = useState<PersonaType>('software_engineer');
  const [instructions, setInstructions] = useState('');
  const [generatedCard, setGeneratedCard] = useState<MemoryCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startProcessing = async () => {
    if (files.length === 0 && !instructions) {
      setError("Por favor, adicione documentos ou instruções.");
      return;
    }
    setStep('processing');
    setError(null);

    try {
      const card = await generateProjectFromDocs(files, instructions, persona, projectType);
      setGeneratedCard(card);
      setStep('review');
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao gerar projeto.");
      setStep('upload');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assistente de Projeto Gemini 3.0</h2>
              <p className="text-indigo-100 text-sm">Do documento ao plano de ação em segundos</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Settings */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Projeto</label>
                    <select 
                      value={projectType} 
                      onChange={(e) => setProjectType(e.target.value as ProjectType)}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                    >
                      <option value="software_development">Desenvolvimento de Software</option>
                      <option value="legal_case">Caso Jurídico</option>
                      <option value="mixed">Híbrido (Misto)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Persona Principal</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(INITIAL_PERSONAS).map(p => (
                        <button
                          key={p.id}
                          onClick={() => setPersona(p.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            persona === p.id 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' 
                            : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                        >
                          <div className="font-medium text-sm">{p.name}</div>
                          <div className="text-xs opacity-70 mt-1">{p.expertise}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Instruções Extras (Opcional)</label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Ex: Foque bastante na fase de testes; O prazo final é Dezembro..."
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 h-32 border resize-none"
                    />
                  </div>
                </div>

                {/* Right: Upload Area */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    Documentos de Referência
                  </h3>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition relative group cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <Upload className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Clique ou arraste arquivos aqui</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT, Imagens (max 50MB)</p>
                      </div>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arquivos Selecionados ({files.length})</p>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                            <div className="flex items-center gap-3 truncate">
                              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[180px]">{file.name}</span>
                              <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)}kb)</span>
                            </div>
                            <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full py-12 animate-in zoom-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-2">Analisando com Gemini 3.0 Pro</h3>
              <p className="text-slate-500 text-center max-w-md">
                A IA está lendo seus documentos, identificando requisitos e estruturando os sprints ideais para o projeto.
              </p>
              
              <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
                 <div className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   Processando contexto multimodal...
                 </div>
                 <div className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 opacity-70">
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   Gerando micro sprints...
                 </div>
                 <div className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 opacity-50">
                   <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                   Estimando horas e riscos...
                 </div>
              </div>
            </div>
          )}

          {step === 'review' && generatedCard && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                 <div>
                   <h3 className="font-bold text-green-800">Estrutura Gerada com Sucesso</h3>
                   <p className="text-green-700 text-sm">O Gemini criou <strong>{generatedCard.sprints.length} sprints</strong> e <strong>{generatedCard.sprints.reduce((acc, s) => acc + s.micro_sprints.length, 0)} micro sprints</strong> baseados nos seus documentos.</p>
                 </div>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-700">{generatedCard.project.name}</h3>
                    <p className="text-sm text-slate-500">{generatedCard.project.description}</p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                     {generatedCard.sprints.map((sprint, sIdx) => (
                       <div key={sprint.id} className="border border-slate-200 rounded-lg">
                          <div className="bg-slate-100 p-3 font-medium text-slate-700 flex justify-between">
                             <span>{sprint.name}</span>
                             <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">{sprint.planned_duration_days} dias</span>
                          </div>
                          <div className="p-3 space-y-3">
                             {sprint.micro_sprints.map((ms, msIdx) => (
                               <div key={ms.id} className="pl-4 border-l-2 border-indigo-200">
                                  <div className="text-sm font-semibold text-slate-800 flex justify-between">
                                    {ms.name}
                                    <span className="text-xs text-slate-500 font-normal">Peso: {ms.weight_in_sprint.toFixed(2)}</span>
                                  </div>
                                  <ul className="mt-2 space-y-1">
                                     {ms.tasks.map(t => (
                                       <li key={t.id} className="text-xs text-slate-600 flex items-center gap-2">
                                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                          {t.description} ({t.estimated_hours}h)
                                       </li>
                                     ))}
                                  </ul>
                               </div>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center flex-shrink-0">
          {step === 'upload' && (
            <>
               <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-medium px-4">Cancelar</button>
               <button 
                 onClick={startProcessing}
                 disabled={files.length === 0 && !instructions}
                 className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2"
               >
                 <Sparkles className="w-5 h-5" />
                 Gerar Projeto com IA
               </button>
            </>
          )}
          
          {step === 'processing' && (
            <div className="w-full text-center text-sm text-slate-400 italic">
               Isso pode levar até 30 segundos...
            </div>
          )}

          {step === 'review' && (
            <>
               <button onClick={() => setStep('upload')} className="text-slate-500 hover:text-slate-800 font-medium px-4">Voltar e Ajustar</button>
               <button 
                 onClick={() => generatedCard && onProjectCreated(generatedCard)}
                 className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-green-200 transition flex items-center gap-2"
               >
                 <CheckCircle2 className="w-5 h-5" />
                 Confirmar e Criar Projeto
               </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIProjectWizard;