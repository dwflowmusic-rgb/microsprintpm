# Especificação do Schema: Memory Card

Este documento detalha a estrutura do arquivo `.json` utilizado para persistência. Integradores podem usar este schema para gerar Memory Cards programaticamente ou migrar dados de outros sistemas.

## Estrutura Raiz

```json
{
  "app_metadata": { ... },
  "project": { ... },
  "personas": { ... },
  "sprints": [ ... ],
  "performance_analytics": { ... },
  "decisions_log": [ ... ],
  "export_history": [ ... ]
}
```

## Detalhe dos Campos

### `app_metadata`
Metadados para controle de versão do arquivo.
- `file_format_version`: String (ex: "1.0"). Usado para migrações futuras.
- `compatibility`: Array de strings. Sistemas que suportam este arquivo.

### `project`
Dados cadastrais.
- `id`: String (UUID ou slug).
- `type`: Enum (`software_development`, `legal_case`, `mixed`). Define a terminologia da UI.
- `active_persona`: String. Define qual persona estava ativa quando o arquivo foi salvo.

### `sprints` (Array)
Lista ordenada de sprints.

#### Objeto `Sprint`
- `micro_sprints`: Array de objetos MicroSprint.
- `sprint_summary`: Objeto de cache com totais (horas, tasks). Opcional na importação (pode ser recalculado), mas recomendado.

#### Objeto `MicroSprint`
- `weight_in_sprint`: Float (0.0 - 1.0). **Crítico**. Define a importância deste bloco.
- `tasks`: Array de objetos Task.
- `persona_analysis`: Objeto onde as chaves são IDs de persona (`software_engineer`, `lawyer`). Contém notas específicas daquela visão.

#### Objeto `Task`
- `id`: String única.
- `status`: Enum (`pending`, `in_progress`, `completed`, `blocked`).
- `estimated_hours`: Number.
- `actual_hours`: Number.

### `personas`
Definição das lentes de análise.
- Permite customizar o nome e as áreas de foco das personas sem mudar o código, apenas editando o JSON.

## Exemplo Mínimo Válido

```json
{
  "app_metadata": {
    "file_format_version": "1.0",
    "created_at": "2023-10-27T10:00:00Z"
  },
  "project": {
    "id": "proj_demo",
    "name": "Demo",
    "type": "software_development",
    "active_persona": "software_engineer"
  },
  "personas": {
    "software_engineer": {
      "id": "software_engineer",
      "name": "Dev",
      "focus_areas": ["Code"],
      "metrics_priority": ["Speed"]
    }
  },
  "sprints": [],
  "performance_analytics": {
    "macro_analysis": {
      "overall_project_completion": 0,
      "sprints_completed": 0,
      "sprints_in_progress": 0,
      "sprints_pending": 0,
      "average_sprint_efficiency": 0,
      "average_velocity": 0,
      "total_hours_invested": 0,
      "total_hours_estimated_remaining": 0
    },
    "micro_analysis": {}
  },
  "decisions_log": [],
  "export_history": []
}
```
