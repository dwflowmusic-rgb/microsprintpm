# Arquitetura do Sistema - MicroSprint PM

Este documento descreve a estrutura técnica, as decisões de design (ADRs) e o modelo de dados do MicroSprint PM.

---

## 1. Visão Geral

O MicroSprint PM é uma aplicação **Client-Side Single Page Application (SPA)** construída com React.

-   **Frontend**: React 18+, TailwindCSS para estilização, Lucide React para ícones, Recharts para visualização de dados.
-   **Gerenciamento de Estado**: React `useState` local (elevado ao componente `App` principal) para simplicidade e portabilidade.
-   **Persistência**: Arquivos JSON locais ("Memory Cards"). Não há banco de dados backend.
-   **Lógica de Negócio**: Separada em `services/projectLogic.ts`, desacoplada da UI.

---

## 2. Decisões Arquiteturais (ADRs)

### ADR-001: Persistência via JSON Local (Memory Card)
*   **Contexto**: Usuários precisam de portabilidade, privacidade e zero dependência de infraestrutura de terceiros.
*   **Decisão**: Usar arquivos JSON que o usuário baixa e sobe.
*   **Consequências**:
    *   (+) Privacidade total (dados nunca saem do navegador, exceto para download).
    *   (+) Custo zero de hospedagem.
    *   (+) Versionamento fácil via Git.
    *   (-) Não permite colaboração em tempo real (multiplayer) nativa.

### ADR-002: Hierarquia de 4 Níveis com Micro Sprints
*   **Contexto**: Sprints de 2 semanas (Scrum clássico) são opacos. É difícil saber se o sprint vai atrasar até o último dia.
*   **Decisão**: Introduzir "Micro Sprint" como unidade de medição de progresso.
*   **Consequências**:
    *   (+) Feedback loop mais rápido (1-3 dias).
    *   (+) Sensação de progresso constante.
    *   (-) Requer um pouco mais de planejamento na quebra de tarefas.

### ADR-003: Cálculo de Progresso Ponderado
*   **Contexto**: Nem toda tarefa tem o mesmo valor. Completar "Corrigir typo" não é igual a "Refatorar Database".
*   **Decisão**: O progresso é calculado baseado no PESO do Micro Sprint, não na contagem de tarefas.
*   **Consequências**:
    *   (+) O gráfico de progresso reflete a realidade do valor entregue.
    *   (-) Usuário precisa estimar peso (subjetivo).

---

## 3. Lógica de Cálculo (Math Model)

O coração do sistema é o `ProgressCalculator`.

### Fórmulas

**1. Progresso do Micro Sprint (`completion_micro_sprint`)**
Simplesmente a porcentagem de tarefas concluídas, pois dentro de um micro sprint, as tarefas tendem a ter granularidade similar.
$$
P_{ms} = \frac{\text{Tarefas Concluídas}}{\text{Total de Tarefas}} \times 100
$$

**2. Contribuição ao Sprint**
Quanto este micro sprint "empurra" a barra do sprint.
$$
C_{ms} = P_{ms} \times \text{Peso}_{ms}
$$
*Onde Peso varia de 0.0 a 1.0.*

**3. Progresso do Sprint**
A soma das contribuições.
$$
P_{sprint} = \sum C_{ms}
$$

**4. Progresso Macro do Projeto**
Considera sprints finalizados e o progresso parcial do sprint atual.
$$
P_{projeto} = \frac{\text{Sprints Completos} + (P_{sprint\_atual} \times \text{Peso}_{sprint\_no\_projeto})}{\text{Total de Sprints Estimados}}
$$

---

## 4. Componentes Principais

### `App.tsx`
O orquestrador. Gerencia:
-   Carregamento/Salvamento do JSON.
-   Estado global `memoryCard`.
-   Roteamento simples (View State: Dashboard vs Sprints).
-   Modal de criação de projeto.

### `services/projectLogic.ts`
Contém a "Inteligência" pura.
-   `createNewMemoryCard()`: Factory para estruturas vazias.
-   `calculateCompletion(card)`: Função pura que recebe um card, recalcula todos os percentuais recursivamente e retorna um novo card imutável. É chamada a cada atualização de tarefa.

### `components/Dashboard.tsx`
Componente híbrido que renderiza:
-   **Modo Macro**: Gráficos de barra, insights de persona.
-   **Modo Sprints**: Lista expansível, gerenciamento de tarefas, inputs de criação.

---

## 5. Fluxo de Dados

1.  Usuário clica em "Completar Tarefa".
2.  UI chama manipulador de evento.
3.  Manipulador atualiza a estrutura de dados localmente.
4.  Manipulador chama `calculateCompletion()` passando os dados sujos.
5.  `calculateCompletion` recalcula percentuais de Micro Sprint -> Sprint -> Projeto.
6.  Novo estado limpo é salvo em `setMemoryCard`.
7.  React re-renderiza a UI com as novas barras de progresso.
