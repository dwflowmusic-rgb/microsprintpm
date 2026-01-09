# Arquitetura do Sistema - MicroSprint PM

Este documento descreve a estrutura técnica, incluindo a integração com IA Generativa.

---

## 1. Visão Geral

O MicroSprint PM é uma SPA (Single Page Application) React.

-   **Frontend**: React 18+, TailwindCSS.
-   **IA**: Google Gemini 3.0 Pro (via `@google/genai` SDK).
-   **Persistência**: Arquivos JSON locais (Memory Cards).
-   **Lógica**: `services/projectLogic.ts` (Cálculos) e `services/aiService.ts` (Integração IA).

---

## 2. Integração com Gemini 3.0 Pro

O "Cérebro" do sistema reside em `services/aiService.ts`.

### Fluxo de Geração
1.  **Input**: Usuário fornece arquivos (File API) e metadados.
2.  **Pré-processamento**: Arquivos são convertidos para Base64 (`application/pdf`, `image/png`, etc.).
3.  **Prompt Engineering**:
    -   O sistema monta um prompt complexo instruindo a IA a atuar como "Arquiteto Sênior".
    -   Injeta o contexto da Persona (Engenheiro/Advogado).
    -   Define as regras de negócio: Sprints de 7-14 dias, Micro Sprints com pesos somando 1.0.
4.  **Structured Output**: Utilizamos o `responseSchema` do Gemini para garantir que a IA retorne estritamente um JSON válido compatível com nossa interface `MemoryCard`.
5.  **Pós-processamento**: O JSON bruto da IA é "hidratado" através da função `createNewMemoryCard` e `calculateCompletion` para garantir IDs únicos e cálculos zerados.

---

## 3. Decisões Arquiteturais (ADRs)

### ADR-004: Gemini 3.0 Pro e Processamento Multimodal
*   **Contexto**: Usuários possuem documentos complexos (PDFs, diagramas) e não querem digitar tudo manualmente.
*   **Decisão**: Usar Gemini 3.0 Pro devido à sua janela de contexto (2M tokens) e capacidade nativa de entender documentos e imagens sem OCR externo.
*   **Consequências**:
    *   (+) Capacidade de ler contratos inteiros ou specs técnicas.
    *   (+) Geração de estrutura altamente contextualizada.
    *   (-) Dependência de conexão com internet e chave de API válida.

### ADR-001: Persistência via JSON Local
*   **Decisão**: Manter o Memory Card como fonte da verdade. A IA gera o JSON, mas não o armazena.
*   **Motivo**: Privacidade e portabilidade.

---

## 4. Modelo de Dados e Cálculos

O sistema utiliza um modelo de cálculo determinístico em `projectLogic.ts` para garantir que, independentemente de como o projeto foi criado (Manual ou IA), as barras de progresso funcionem da mesma forma.

$$
P_{sprint} = \sum (P_{micro\_sprint} \times \text{Peso}_{micro\_sprint})
$$

A IA é instruída a gerar pesos (`weight_in_sprint`) que somem 1.0 para manter a consistência matemática.
