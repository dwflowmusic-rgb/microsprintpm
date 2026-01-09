# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.1.0] - 2024-05-21

### Adicionado (IA & Automação)
-   **Assistente de Projeto AI**: Novo wizard (`AIProjectWizard`) que permite criar projetos via upload de documentos.
-   **Integração Gemini 3.0 Pro**: Uso do modelo mais recente do Google para análise multimodal e raciocínio complexo.
-   **Geração Automática**: Sprints, Micro Sprints, Pesos e Tarefas são gerados automaticamente a partir de PDFs/Imagens.
-   **Schema Estruturado**: Uso de JSON Schema na API do Gemini para garantir integridade do Memory Card gerado.

### Alterado
-   Atualização da tela inicial (`App.tsx`) para incluir opção de criação via IA.
-   Refatoração de `metadata.json` para incluir permissões e descrição atualizada.

## [1.0.0] - 2024-05-20

### Adicionado
-   Lançamento inicial do sistema (Criação Manual).
-   Dashboard com visão Macro e Micro.
-   Suporte a Memory Card (JSON).
-   Hierarquia de 4 Níveis.
-   Sistema de Personas.
