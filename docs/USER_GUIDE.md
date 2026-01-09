# Guia do Usuário - MicroSprint PM

Bem-vindo ao guia definitivo do MicroSprint PM. Este documento levará você desde os conceitos básicos até fluxos de trabalho avançados.

---

## 1. Conceitos Fundamentais

Antes de clicar nos botões, é crucial entender a filosofia do sistema:

### A Hierarquia Temporal
O sistema não vê o trabalho apenas como uma lista de tarefas. Ele usa uma estrutura de 4 níveis:
1.  **Projeto**: O objetivo macro (ex: "Lançar App Mobile"). Dura meses.
2.  **Sprint**: Um ciclo de 1-2 semanas com uma meta entregável (ex: "Autenticação e Login").
3.  **Micro Sprint**: A inovação do sistema. Blocos de 1 a 3 dias (ex: "Implementar JWT", "Telas de Login"). É aqui que o progresso real é medido.
4.  **Tarefa**: A unidade atômica (ex: "Instalar lib", "Criar rota API").

### O Memory Card
Imagine um videogame antigo. Você joga, salva no cartão de memória e pode levar esse cartão para a casa de um amigo.
O **Memory Card** aqui é um arquivo `.json`.
- **Salvar**: O sistema gera um arquivo com TODO o estado atual.
- **Carregar**: Você sobe esse arquivo e o sistema restaura tudo: tarefas, status, persona ativa, histórico.
**Vantagem**: Seus dados não ficam presos em um banco de dados de terceiros.

### Personas
Você é um desenvolvedor que também cuida de contratos?
- **Persona Engenheiro**: Foca em código, testes, débito técnico.
- **Persona Advogado**: Foca em prazos, compliance, riscos.
O sistema muda a interface e os insights baseados em qual "chapéu" você está usando no momento.

---

## 2. Tutorial: Seu Primeiro Projeto

### Passo 1: Criação
1.  Na tela inicial, clique em **"Criar Novo Projeto"**.
2.  Preencha:
    -   **Nome**: "Sistema de Blog"
    -   **Tipo**: Desenvolvimento de Software
    -   **Descrição**: "Um blog simples em React e Node."
3.  O sistema criará o "Memory Card" na memória do navegador.

### Passo 2: Estruturando Sprints
1.  Vá para a aba **"Sprints & Tarefas"**.
2.  No painel "Planejar Próximo Sprint", digite "Sprint 1: Setup" e clique em **Criar Sprint**.
3.  O Sprint aparecerá na lista como *PENDENTE*.

### Passo 3: O Poder dos Micro Sprints
Agora vamos quebrar esse Sprint de 1 semana em pedaços menores.
1.  Expanda o "Sprint 1".
2.  Em "Novo Micro Sprint", digite: "Configuração Backend".
3.  **Peso**: Selecione "50%" (0.5). Isso significa que completar isso vale metade do Sprint inteiro.
4.  Clique em **Adicionar**.

### Passo 4: Trabalhando
1.  Expanda o Micro Sprint "Configuração Backend".
2.  Adicione tarefas: "Instalar Express", "Configurar TS", "Criar rota Healthcheck".
3.  Conforme você completa as tarefas (clicando no check), a barra de progresso do Micro Sprint sobe.
4.  Automaticamente, a barra do Sprint sobe proporcionalmente ao peso.

### Passo 5: Salvando
1.  Terminou o dia? Clique em **"Salvar Memory Card"** na barra lateral.
2.  O navegador baixará um arquivo `project_sistema_de_blog_YYYY-MM-DD.json`.
3.  Guarde este arquivo. Ele é o seu projeto.

---

## 3. Workflows Comuns

### Workflow A: Troca de Máquina
1.  Você trabalhou no escritório e salvou o `json`.
2.  Chegou em casa, abriu o MicroSprint PM (que está "zerado").
3.  Clique em **"Carregar Memory Card"** e selecione seu arquivo.
4.  Pronto! Todo o seu progresso está lá.

### Workflow B: Análise de Riscos (Modo Advogado)
1.  Você está codando, mas precisa ver se está dentro do prazo contratual.
2.  Na barra lateral, clique no card de Persona (onde diz "Engenheiro de Software").
3.  O sistema muda para **"Especialista Jurídico"**.
4.  Vá ao Dashboard. Os insights agora focam em conformidade e prazos, não em qualidade de código.

### Workflow C: Versionamento com Git
Como o projeto é um arquivo texto (JSON):
1.  Crie um repositório git para seus projetos.
2.  Salve o Memory Card na pasta do repo.
3.  Faça commit: `git commit -am "Fim do dia: Backend configurado"`.
4.  Você tem um histórico imutável de todo o seu gerenciamento.

---

## 4. Dicas e Melhores Práticas

- **Micro Sprints Curtos**: Tente manter micro sprints que durem no máximo 3 dias. Se for maior, quebre em dois.
- **Pesos Reais**: Se um Micro Sprint é difícil, dê um peso maior (ex: 0.6), mesmo que tenha poucas tarefas. O peso reflete o *esforço*, não a quantidade de checkboxes.
- **Backup Diário**: Crie o hábito de baixar o Memory Card ao encerrar o expediente.
- **Notas Técnicas**: Use o campo de descrição das tarefas para anotar versões de bibliotecas ou decisões rápidas.

---

## 5. Resolução de Problemas (Troubleshooting)

**Problema**: O progresso do Sprint travou em 99% mesmo com tudo completo.
**Solução**: Verifique se a soma dos pesos dos Micro Sprints é exatamente 1.0 (100%). O sistema tenta arredondar, mas pesos inconsistentes podem causar desvios visuais.

**Problema**: O arquivo JSON não carrega.
**Solução**: Certifique-se de que o arquivo não foi corrompido ou editado manualmente com erros de sintaxe. Use um validador JSON online se editou manualmente.
