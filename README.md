# MicroSprint PM

> **Sistema Avançado de Gerenciamento de Projetos com Micro Sprints, Visões Multi-Persona e Persistência Portátil via Memory Card.**

![Status](https://img.shields.io/badge/status-stable-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## 📋 Visão Geral Executiva

**O que é:** O MicroSprint PM é um sistema de gerenciamento de projetos projetado para alta granularidade. Diferente de ferramentas tradicionais que param no nível do "Sprint", o MicroSprint PM introduz o conceito de **Micro Sprints** (ciclos de 1-3 dias), permitindo um rastreamento ultra-preciso do progresso.

**Por que existe:** Profissionais híbridos (ex: desenvolvedores que também gerenciam contratos, ou gestores técnicos) precisam alternar entre contextos complexos sem perder o histórico. Ferramentas atuais ou são muito rígidas (Jira) ou muito simples (Trello). O MicroSprint PM resolve isso com **Visões Multi-Persona** (analisar o mesmo projeto como Engenheiro ou Advogado) e **Portabilidade Total**.

**O Diferencial:** O conceito de **Memory Card**. Todo o estado do seu projeto reside em um único arquivo JSON autossuficiente. Você não depende de um servidor central. Salve seu arquivo, envie por e-mail, version no Git, ou carregue em outra máquina e continue exatamente de onde parou.

---

## ✨ Principais Funcionalidades

| Recurso | Descrição |
| :--- | :--- |
| 🎯 **Hierarquia de 4 Níveis** | Projeto → Sprint → Micro Sprint → Tarefa. Granularidade real para controle diário. |
| 💾 **Memory Card Portátil** | Estado completo em JSON. Zero vendor lock-in. Seus dados são seus. |
| 🧠 **Análise Multi-Persona** | Alterne instantaneamente entre visão técnica (Engenheiro) e visão de compliance (Jurídico). |
| 📊 **Progresso Ponderado** | Cálculos matemáticos precisos de progresso baseados em pesos de micro sprints, não apenas contagem de tarefas. |
| ⚡ **Velocity & Eficiência** | Métricas automáticas de velocidade e eficiência (Horas Reais vs Estimadas). |
| 🛡️ **Rastreabilidade** | Histórico de decisões técnicas e log de alterações imutável. |

---

## 🚀 Quick Start (Começo Rápido)

### Pré-requisitos
- Um navegador moderno (Chrome, Edge, Firefox, Safari).
- (Opcional) Node.js instalado se for rodar localmente.

### Rodando Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/microsprint-pm.git
   cd microsprint-pm
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie a aplicação:**
   ```bash
   npm start
   ```

4. Acesse `http://localhost:3000` no seu navegador.

### Usando a Aplicação

1. Clique em **"Criar Novo Projeto"**.
2. Defina o nome (ex: "Migração Cloud") e a Persona Principal (ex: Engenheiro de Software).
3. No Dashboard, vá para a aba **Sprints & Tarefas**.
4. Crie seu primeiro Sprint (ex: "Sprint 1: Fundação").
5. Dentro do Sprint, crie um **Micro Sprint** (ex: "Configuração de Ambiente", Peso: 0.3).
6. Adicione tarefas e comece a trabalhar!
7. Ao final do dia, clique em **"Salvar Memory Card"** para baixar seu JSON de backup.

---

## 📚 Documentação Completa

Para detalhes profundos, consulte nossos guias especializados:

- [📖 **Guia do Usuário**](docs/USER_GUIDE.md): Tutorial passo-a-passo para dominar o sistema.
- [🏗️ **Arquitetura**](docs/ARCHITECTURE.md): Decisões de design, estrutura técnica e cálculos.
- [🧩 **Referência da API & Lógica**](docs/API_REFERENCE.md): Detalhes das funções internas e lógica de negócio.
- [💾 **Schema do Memory Card**](docs/MEMORY_CARD_SCHEMA.md): Especificação técnica do formato JSON.
- [💡 **Exemplos Práticos**](docs/EXAMPLES.md): Casos de uso reais (Dev e Jurídico).
- [🤝 **Guia de Contribuição**](docs/CONTRIBUTING.md): Como ajudar a evoluir o projeto.
- [📝 **Changelog**](docs/CHANGELOG.md): Histórico de versões e mudanças.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---
*Construído com React, TailwindCSS e Lucide Icons.*
