# MicroSprint PM

> **Sistema Avançado de Gerenciamento de Projetos com Micro Sprints, Visões Multi-Persona, Persistência Portátil e "Cérebro" de IA (Gemini 3.0).**

![Status](https://img.shields.io/badge/status-stable-green)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)
![AI-Powered](https://img.shields.io/badge/AI-Gemini%203.0%20Pro-purple)

## 📋 Visão Geral Executiva

**O que é:** O MicroSprint PM é um sistema de gerenciamento de projetos projetado para alta granularidade. Diferente de ferramentas tradicionais, ele introduz **Micro Sprints** (ciclos de 1-3 dias) e utiliza **Inteligência Artificial Multimodal** para ler seus documentos de planejamento (PDFs, DOCX) e gerar a estrutura do projeto automaticamente.

**Por que existe:** Criar cronogramas do zero é trabalhoso. O MicroSprint PM elimina esse atrito. Você faz upload do seu briefing ou PRD, e o **Gemini 3.0 Pro** estrutura sprints, estima horas e identifica riscos, adaptando tudo para a visão de Engenheiros ou Advogados.

**O Diferencial:** O conceito de **Memory Card**. Todo o estado do seu projeto reside em um único arquivo JSON autossuficiente. Salve, envie por e-mail ou version no Git.

---

## ✨ Principais Funcionalidades

| Recurso | Descrição |
| :--- | :--- |
| 🧠 **Cérebro AI (Gemini 3.0)** | Arraste documentos e deixe a IA criar Sprints, Micro Sprints e Tasks automaticamente. |
| 🎯 **Hierarquia de 4 Níveis** | Projeto → Sprint → Micro Sprint → Tarefa. Granularidade real. |
| 💾 **Memory Card Portátil** | Estado completo em JSON. Zero vendor lock-in. |
| 🧩 **Análise Multi-Persona** | Alterne instantaneamente entre visão técnica e jurídica. |
| 📊 **Progresso Ponderado** | Cálculos matemáticos precisos baseados em pesos de micro sprints. |
| ⚡ **Velocity & Eficiência** | Métricas automáticas de velocidade e eficiência. |

---

## 🚀 Quick Start (Começo Rápido)

### Pré-requisitos
- Navegador moderno.
- Chave de API do Google Gemini (`API_KEY`) configurada no ambiente.

### Criando um Projeto com IA

1. Abra a aplicação.
2. Clique no botão roxo **"Criar Projeto com IA (Gemini 3.0)"**.
3. Selecione o tipo de projeto (ex: Software) e a Persona (ex: Engenheiro).
4. **Arraste seus arquivos** (PDFs, Imagens de Wireframes, Docs de requisitos).
5. Clique em **Gerar**.
6. Revise a estrutura criada pela IA e confirme.
7. Pronto! Seu projeto de meses foi planejado em segundos.

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

---

## 📚 Documentação Completa

- [📖 **Guia do Usuário**](docs/USER_GUIDE.md): Tutorial passo-a-passo (Manual e IA).
- [🏗️ **Arquitetura**](docs/ARCHITECTURE.md): Detalhes da integração com Gemini e lógica de cálculo.
- [🧩 **Referência da API**](docs/API_REFERENCE.md): Funções internas e serviços de IA.
- [💾 **Schema do Memory Card**](docs/MEMORY_CARD_SCHEMA.md): Especificação do JSON.
- [🤝 **Guia de Contribuição**](docs/CONTRIBUTING.md): Como ajudar.
- [📝 **Changelog**](docs/CHANGELOG.md): Histórico de versões (v1.1.0).

---

## 📄 Licença

Licença MIT. Construído com React, TailwindCSS, Lucide Icons e Google GenAI SDK.
