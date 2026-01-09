# Guia de Contribuição

Obrigado pelo interesse em contribuir para o MicroSprint PM! Este documento orienta como você pode ajudar.

## Código de Conduta
Esperamos que todos os colaboradores sejam respeitosos e construtivos. Críticas devem ser direcionadas ao código, não à pessoa.

## Como Contribuir

### 1. Reportando Bugs
Abra uma Issue descrevendo:
- Passos para reproduzir.
- Comportamento esperado.
- Comportamento real.
- Se possível, anexe um Memory Card JSON (anônimo) que causa o erro.

### 2. Sugerindo Funcionalidades
Temos interesse em:
- Novos tipos de gráficos no Dashboard.
- Mais personas padrão.
- Integrações de exportação (PDF, Markdown).

### 3. Pull Requests (Código)
1.  Faça um **Fork** do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/nova-analise`).
3.  Siga o estilo de código existente (TypeScript estrito, componentes funcionais React).
4.  **Importante**: Se alterar a lógica de cálculo em `projectLogic.ts`, adicione testes ou verifique manualmente se o progresso não quebrou.
5.  Abra um Pull Request descrevendo as mudanças.

## Padrões de Projeto

-   **Imutabilidade**: Nunca altere o objeto `memoryCard` diretamente. Sempre crie cópias.
-   **Tipagem**: Evite `any`. Use as interfaces de `types.ts`.
-   **Internacionalização**: O projeto está atualmente em **Português do Brasil**. Mantenha strings de UI em PT-BR.

## Setup de Desenvolvimento

```bash
npm install
npm start
```
