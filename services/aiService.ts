import { GoogleGenAI, Type } from "@google/genai";
import { MemoryCard, ProjectType, PersonaType } from "../types";
import { createNewMemoryCard, calculateCompletion } from "./projectLogic";

// Helper for Base64 conversion
export const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // DataURL format: data:mime/type;base64,.....
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Uses Gemini 3.0 Pro to analyze documents and generate the MemoryCard structure
 */
export const generateProjectFromDocs = async (
  files: File[],
  additionalInstructions: string,
  persona: PersonaType,
  projectType: ProjectType
): Promise<MemoryCard> => {
  
  // Safe Access to API Key
  const apiKey = process.env.API_KEY || (window.process && window.process.env && window.process.env.API_KEY);
  
  if (!apiKey) {
    throw new Error("Erro de Configuração: API_KEY não encontrada no process.env. O ambiente deve injetar a chave.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Prepare file parts
  const fileParts = await Promise.all(files.map(fileToPart));

  const systemPrompt = `
    Você é um Arquiteto de Projetos Sênior e Especialista em Micro Sprints.
    Sua tarefa é analisar os documentos fornecidos e estruturar um projeto completo no formato JSON "Memory Card".
    
    CONCEITOS:
    - Projeto: O objetivo macro.
    - Sprint: Ciclos de 7 a 14 dias.
    - Micro Sprint: Blocos de 1-3 dias. A soma dos pesos (weight_in_sprint) dos micro sprints dentro de um sprint deve ser 1.0 (ou muito próximo).
    - Task: Tarefas atômicas (0.5h a 16h).
    
    CONTEXTO:
    - Tipo de Projeto: ${projectType}
    - Persona Principal: ${persona} (Adapte a linguagem e o foco técnico/jurídico para esta persona).
    - Instruções Adicionais do Usuário: "${additionalInstructions}"

    REGRAS DE GERAÇÃO:
    1. Crie uma estrutura lógica temporal (Sprint 1: Setup/Fundação -> Sprint N: Entrega Final).
    2. Gere pelo menos 2 Sprints.
    3. Quebre cada Sprint em 2-4 Micro Sprints lógicos.
    4. Crie 3-5 tasks por Micro Sprint com estimativas de horas realistas.
    5. Defina datas começando a partir de "HOJE" (assuma a data atual para o início do Sprint 1).
    6. Gere análises de persona detalhadas para cada Micro Sprint.
    7. O campo 'id' deve ser único (use strings curtas como 'sprint_1', 'ms_1_1').
    
    RETORNE APENAS O JSON VÁLIDO SEGUINDO O SCHEMA EXATO.
  `;

  // Define the expected Schema for Structured Output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      projectName: { type: Type.STRING, description: "Nome do projeto extraído ou sugerido" },
      projectDescription: { type: Type.STRING, description: "Descrição executiva do projeto" },
      sprints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            planned_duration_days: { type: Type.NUMBER },
            micro_sprints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weight_in_sprint: { type: Type.NUMBER, description: "Deve somar 1.0 no total do sprint" },
                  estimated_hours: { type: Type.NUMBER, description: "Soma das tasks" },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        description: { type: Type.STRING },
                        estimated_hours: { type: Type.NUMBER }
                      }
                    }
                  },
                  persona_analysis_text: { type: Type.STRING, description: "Análise técnica/jurídica breve deste micro sprint" }
                }
              }
            }
          }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Gemini 3 for high reasoning
      contents: {
        parts: [
          ...fileParts,
          { text: systemPrompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 2048 } // Enable thinking for better decomposition
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou texto.");

    const generatedData = JSON.parse(text);
    
    // Hydrate the raw JSON into a full MemoryCard object
    const emptyCard = createNewMemoryCard(
      generatedData.projectName || "Projeto Gerado via IA",
      projectType,
      generatedData.projectDescription || "Gerado automaticamente pelo Gemini 3.0 Pro",
      "IA Assistant"
    );

    // Set Persona
    emptyCard.project.active_persona = persona;

    // Transform Sprints
    let startDate = new Date();
    
    emptyCard.sprints = (generatedData.sprints || []).map((s: any, sIdx: number) => {
      const sprintId = `sprint_${sIdx + 1}`;
      const duration = s.planned_duration_days || 7;
      
      // Calculate dates
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + duration);
      
      // Advance start date for next sprint
      startDate = new Date(end);
      // Add 1 day gap
      startDate.setDate(startDate.getDate() + 1);

      return {
        id: sprintId,
        name: s.name || `Sprint ${sIdx+1}`,
        description: s.description || "",
        status: sIdx === 0 ? 'in_progress' : 'pending',
        start_date: start.toISOString().split('T')[0],
        planned_end_date: end.toISOString().split('T')[0],
        planned_duration_days: duration,
        completion_percentage: 0,
        micro_sprints: (s.micro_sprints || []).map((ms: any, msIdx: number) => {
          const msId = `${sprintId}_ms_${msIdx + 1}`;
          
          // Construct Persona Analysis object
          const analysis: any = {};
          analysis[persona] = {
            technical_notes: ms.persona_analysis_text || "",
            compliance_notes: ms.persona_analysis_text || "", // Fallback for lawyer
            metrics: { "AI Confidence": "High" }
          };

          return {
            id: msId,
            name: ms.name || `Micro Sprint ${msIdx+1}`,
            description: ms.description || "",
            status: sIdx === 0 && msIdx === 0 ? 'in_progress' : 'pending',
            weight_in_sprint: ms.weight_in_sprint || (1 / (s.micro_sprints?.length || 1)),
            estimated_hours: ms.estimated_hours || 0,
            actual_hours: 0,
            completion_percentage: 0,
            custom_annotations: [],
            persona_analysis: analysis,
            tasks: (ms.tasks || []).map((t: any, tIdx: number) => ({
              id: `${msId}_task_${tIdx + 1}`,
              description: t.description || "Nova Tarefa",
              status: 'pending',
              estimated_hours: t.estimated_hours || 1,
              actual_hours: 0
            }))
          };
        }),
        sprint_summary: {
          total_micro_sprints: 0, completed_micro_sprints: 0,
          total_tasks: 0, completed_tasks: 0,
          total_estimated_hours: 0, total_actual_hours: 0,
          efficiency_ratio: 0, velocity: 0
        }
      };
    });

    // Run the calculation logic
    return calculateCompletion(emptyCard);

  } catch (error) {
    console.error("Erro na geração IA:", error);
    throw new Error("Falha ao processar documentos com Gemini. Verifique se sua chave API é válida e suporta o modelo Gemini 3.0 Pro.");
  }
};