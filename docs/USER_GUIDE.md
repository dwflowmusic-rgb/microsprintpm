# Guia do Usuário - MicroSprint PM

Bem-vindo ao guia definitivo do MicroSprint PM. Este documento cobre desde a criação manual até a geração automática de projetos via IA.

---

## 1. Conceitos Fundamentais

### A Hierarquia Temporal
O sistema usa uma estrutura de 4 níveis:
1.  **Projeto**: O objetivo macro (ex: "Lançar App Mobile").
2.  **Sprint**: Ciclo de 1-2 semanas.
3.  **Micro Sprint**: Blocos de 1-3 dias. A inovação central para rastreamento granular.
4.  **Tarefa**: A unidade atômica (ex: "Configurar Docker").

### O Memory Card
Seu projeto é um arquivo `.json`.
- **Salvar**: Baixa o arquivo com TODO o estado.
- **Carregar**: Restaura o projeto em qualquer máquina.

---

## 2. Criando Projetos (Modo IA - Recomendado)

O "Cérebro" do MicroSprint PM usa o **Gemini 3.0 Pro** para ler seus documentos e fazer o trabalho pesado de planejamento.

### Passo 1: Iniciar o Assistente
1.  Na tela inicial, clique no botão em destaque: **"Criar Projeto com IA"**.
2.  Um modal abrirá.

### Passo 2: Contexto e Upload
1.  **Tipo de Projeto**: Escolha se é Software, Jurídico ou Misto.
2.  **Persona**: Quem é você? (Engenheiro ou Advogado). Isso define a linguagem que a IA usará.
3.  **Upload**: Arraste seus arquivos para a área pontilhada.
    -   *Suportado*: PDF, DOCX, TXT, Imagens (PNG/JPG).
    -   *Exemplo*: Arraste o PDF do contrato e uma imagem da arquitetura do sistema.
4.  **Instruções Extras**: (Opcional) Diga algo como "O prazo final é dia 20 de Dezembro" ou "Foque em testes de segurança".

### Passo 3: Geração e Revisão
1.  Clique em **"Gerar Projeto com IA"**.
2.  Aguarde (pode levar até 30s). A IA está lendo, pensando e estruturando os sprints.
3.  **Tela de Revisão**: O sistema mostrará a estrutura gerada.
    -   Verifique os Sprints criados.
    -   Veja se as horas estimadas fazem sentido.
4.  Se estiver satisfeito, clique em **"Confirmar e Criar Projeto"**.

---

## 3. Criando Projetos (Modo Manual)

Se preferir controle total desde o início:

1.  Clique em **"Criar Manualmente"**.
2.  Defina Nome e Descrição.
3.  Vá para a aba **"Sprints & Tarefas"**.
4.  Crie Sprints manualmente.
5.  Adicione Micro Sprints e defina seus pesos (lembre-se: a soma dos pesos deve ser ~1.0 por Sprint).
6.  Adicione tarefas.

---

## 4. Trabalhando no Dia a Dia

### Atualizando Progresso
1.  Abra o Micro Sprint atual.
2.  Clique no checkbox das tarefas concluídas.
3.  O sistema recalcula automaticamente:
    -   Progresso do Micro Sprint.
    -   Progresso do Sprint (ponderado pelo peso).
    -   Progresso Geral do Projeto.

### Trocando de Persona
1.  Na barra lateral, clique no card de Persona.
2.  O sistema alterna entre **Engenheiro de Software** e **Especialista Jurídico**.
3.  Observe como os "Insights" no Dashboard mudam para refletir novas prioridades (ex: Qualidade de Código vs. Prazos Legais).

---

## 5. Salvando e Compartilhando

1.  Sempre clique em **"Salvar Memory Card"** ao final da sessão.
2.  Guarde o arquivo JSON baixado.
3.  Para continuar em outro computador, use a opção **"Carregar Memory Card"** na tela inicial.
