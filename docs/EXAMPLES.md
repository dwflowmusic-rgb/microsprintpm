# Galeria de Exemplos

Exemplos práticos de como estruturar seus projetos no MicroSprint PM.

---

## Exemplo 1: Desenvolvimento de E-commerce

**Contexto**: Criação de uma loja virtual pequena.
**Persona Ativa**: Engenheiro de Software.

### Estrutura de Sprints

**Sprint 1: Core & Catálogo (Peso Global: 0.3)**
-   **Micro Sprint 1.1: Setup Infra (Peso: 0.2)**
    -   [x] Configurar AWS S3
    -   [x] Configurar Banco PostgreSQL
-   **Micro Sprint 1.2: Modelagem de Dados (Peso: 0.3)**
    -   [x] Criar tabelas Produtos/Categorias
    -   [x] Migrations
-   **Micro Sprint 1.3: API Produtos (Peso: 0.5)**
    -   [ ] CRUD Produtos
    -   [ ] Upload de Imagens
    -   [ ] Testes Unitários

**Sprint 2: Carrinho & Checkout (Peso Global: 0.4)**
...

---

## Exemplo 2: Contrato de Fusão Empresarial

**Contexto**: Escritório de advocacia gerenciando M&A.
**Persona Ativa**: Especialista Jurídico.

### Estrutura de Sprints

**Sprint 1: Due Diligence (Peso Global: 0.5)**
-   **Micro Sprint 1.1: Coleta de Documentos (Peso: 0.4)**
    -   [x] Solicitar contratos de trabalho
    -   [x] Solicitar balanços fiscais
    -   [ ] Verificar certidões negativas
-   **Micro Sprint 1.2: Análise de Riscos (Peso: 0.6)**
    -   [ ] Mapear passivos trabalhistas
    -   [ ] Avaliar propriedade intelectual

*Nota: Ao mudar para a persona "Engenheiro", este projeto pareceria estranho, mas o sistema suporta a estrutura hierárquica perfeitamente, garantindo que os prazos da Due Diligence sejam cumpridos.*

---

## Exemplo 3: Projeto Híbrido (Startup LegalTech)

**Contexto**: Criar um bot que lê contratos. Envolve Dev e Jurídico.

1.  O **Engenheiro** entra, cria o Sprint "Treinamento de IA".
    -   Micro Sprint: "Dataset Cleaning".
    -   Métrica: Acurácia do modelo.
2.  O **Advogado** entra, muda a persona.
    -   Vê o mesmo Sprint.
    -   Adiciona anotação no Micro Sprint: "Garantir que os dados de treino não violem LGPD".
    -   Verifica se o prazo de entrega do modelo bate com a data de lançamento do produto.
