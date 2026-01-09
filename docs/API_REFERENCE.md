# Referência da API Interna e Lógica

Como o MicroSprint PM é uma aplicação client-side, esta "API" refere-se às funções TypeScript exportadas em `services/projectLogic.ts` e manipuladores de estado principais. Desenvolvedores que desejam estender o sistema devem usar estas funções.

---

## Gerenciamento de Memória

### `createNewMemoryCard`

Cria a estrutura inicial de um projeto.

**Assinatura:**
```typescript
const createNewMemoryCard = (
  name: string, 
  type: ProjectType, 
  description: string, 
  owner: string
): MemoryCard
```

**Parâmetros:**
- `name`: Nome do projeto.
- `type`: `'software_development' | 'legal_case' | 'mixed'`.
- `description`: Texto descritivo.
- `owner`: Nome do responsável.

**Retorno:** Objeto `MemoryCard` inicializado com metadados, personas padrão e arrays vazios.

---

### `calculateCompletion`

A função mais crítica do sistema. Deve ser chamada após **qualquer** modificação no estado (adicionar tarefa, mudar status, etc.). Ela garante integridade dos dados.

**Assinatura:**
```typescript
const calculateCompletion = (card: MemoryCard): MemoryCard
```

**O que ela faz:**
1.  Itera sobre todos os Micro Sprints.
2.  Calcula `%` de conclusão baseado nas tarefas.
3.  Atualiza `status` do Micro Sprint (Pending -> In Progress -> Completed).
4.  Soma horas reais e estimadas.
5.  Sobe para o nível do Sprint: calcula progresso ponderado pelos pesos.
6.  Atualiza `status` do Sprint.
7.  Sobe para o nível do Projeto: atualiza `macro_analysis`.
8.  Retorna um **novo** objeto (Imutabilidade).

---

## Estrutura de Tipos (`types.ts`)

### `MemoryCard`
O objeto raiz.
```typescript
interface MemoryCard {
  app_metadata: AppMetadata;
  project: Project;
  personas: Record<PersonaType, PersonaDef>;
  sprints: Sprint[];
  performance_analytics: PerformanceAnalytics;
  // ...
}
```

### `MicroSprint`
A unidade de trabalho.
```typescript
interface MicroSprint {
  id: string;
  weight_in_sprint: number; // 0.0 a 1.0 (Deve somar ~1.0 no sprint)
  completion_percentage: number; // 0 a 100
  tasks: Task[];
  persona_analysis: Record<PersonaType, PersonaAnalysis>;
  // ...
}
```

---

## Utilitários

### `generateId`
Gera IDs únicos legíveis para depuração.
**Uso:** `generateId('task')` -> `task_1709823_xyz`

---

## Manipuladores de Ação (UI)

Estas lógicas residem dentro dos componentes React (`Dashboard.tsx`), mas representam os "Comandos" do sistema.

### `toggleTaskStatus`
Alterna entre `pending` e `completed`.
- **Lógica**: Se mudar para `completed`, assume horas reais = estimadas (se não preenchido). Dispara `calculateCompletion`.

### `addSprint`
Adiciona um novo sprint ao array.
- **Padrão**: Duração de 7 dias, status `pending`.

### `addMicroSprint`
Adiciona um micro sprint.
- **Validação**: O sistema atualmente permite soma de pesos > 1.0, mas a documentação recomenda manter em 1.0.
