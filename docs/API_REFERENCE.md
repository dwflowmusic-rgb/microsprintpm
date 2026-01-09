# Referência da API Interna

## Serviços de IA (`services/aiService.ts`)

### `generateProjectFromDocs`

A função principal que orquestra a chamada ao Gemini.

**Assinatura:**
```typescript
const generateProjectFromDocs = async (
  files: File[],
  additionalInstructions: string,
  persona: PersonaType,
  projectType: ProjectType
): Promise<MemoryCard>
```

**Parâmetros:**
- `files`: Array de objetos File do navegador (PDF, Imagens, etc).
- `additionalInstructions`: String com dicas do usuário.
- `persona`: Define o tom e foco da análise da IA.
- `projectType`: Contexto do domínio.

**Retorno:** Promessa que resolve em um objeto `MemoryCard` completo e validado.

**Comportamento:**
- Converte arquivos para Base64.
- Usa `gemini-3-pro-preview`.
- Habilita `thinkingConfig` para decomposição complexa de tarefas.
- Enforce `responseSchema` para garantir JSON estruturado.

---

## Lógica de Projeto (`services/projectLogic.ts`)

### `createNewMemoryCard`
Factory para criar estrutura vazia. Usada internamente pela IA para inicializar o objeto antes de popular os sprints.

### `calculateCompletion`
Recalcula toda a árvore de progresso.
*Importante:* A IA gera os dados brutos (Tasks, Sprints), mas esta função deve ser chamada imediatamente após a geração para calcular os percentuais iniciais (que serão 0%) e status corretos.

---

## Tipos Principais

### `MemoryCard`
Estrutura raiz que a IA deve preencher. Contém `project`, `sprints`, `personas`.

### `Sprint` e `MicroSprint`
A IA é instruída a gerar:
- `Sprint`: Duração planejada em dias.
- `MicroSprint`: Peso (`weight_in_sprint`) e análise de persona (`persona_analysis`).
