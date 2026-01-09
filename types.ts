export type PersonaType = 'software_engineer' | 'lawyer';
export type ProjectType = 'software_development' | 'legal_case' | 'mixed';
export type Status = 'completed' | 'in_progress' | 'pending' | 'blocked';

export interface AppMetadata {
  app_version: string;
  created_at: string;
  last_modified: string;
  file_format_version: string;
  compatibility: string[];
}

export interface PersonaDef {
  id: PersonaType;
  name: string;
  expertise: string;
  tone: string;
  focus_areas: string[];
  metrics_priority: string[];
}

export interface Task {
  id: string;
  description: string;
  status: Status;
  estimated_hours: number;
  actual_hours: number;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  blockers?: string[];
}

export interface Annotation {
  id: string;
  timestamp: string;
  user: string;
  text: string;
  type: 'scope_change' | 'technical_decision' | 'blocker_resolution';
}

export interface PersonaAnalysis {
  technical_notes?: string;
  decisions?: string[];
  technical_debt?: string[];
  next_recommendations?: string;
  metrics?: Record<string, string>; // Flexible for varying metrics
  
  compliance_notes?: string;
  deadlines_status?: string;
  documentation_gaps?: string[];
  risks_identified?: string[];
  risks_mitigated?: string[];
}

export interface MicroSprint {
  id: string;
  name: string;
  description: string;
  status: Status;
  weight_in_sprint: number; // 0.0 to 1.0
  start_date?: string;
  planned_end_date?: string;
  actual_end_date?: string;
  estimated_hours: number;
  actual_hours: number;
  completion_percentage: number;
  tasks: Task[];
  persona_analysis: {
    [key in PersonaType]?: PersonaAnalysis;
  };
  custom_annotations: Annotation[];
}

export interface SprintSummary {
  total_micro_sprints: number;
  completed_micro_sprints: number;
  total_tasks: number;
  completed_tasks: number;
  total_estimated_hours: number;
  total_actual_hours: number;
  efficiency_ratio: number;
  velocity: number;
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  status: Status;
  start_date: string;
  planned_end_date: string;
  actual_end_date?: string;
  planned_duration_days: number;
  actual_duration_days?: number;
  completion_percentage: number;
  micro_sprints: MicroSprint[];
  sprint_summary: SprintSummary;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  owner: string;
  created_at: string;
  current_sprint?: string;
  active_persona: PersonaType;
}

export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  decision: string;
  rationale: string;
  alternatives_considered: string[];
  impact: string;
  decided_by: string;
  sprint_context?: string;
  micro_sprint_context?: string;
}

export interface PerformanceAnalytics {
  macro_analysis: {
    overall_project_completion: number;
    sprints_completed: number;
    sprints_in_progress: number;
    sprints_pending: number;
    average_sprint_efficiency: number;
    average_velocity: number;
    estimated_completion_date: string;
    total_hours_invested: number;
    total_hours_estimated_remaining: number;
  };
  micro_analysis: {
    current_sprint?: {
      sprint_id: string;
      completion: number;
      current_velocity: number;
      estimated_remaining_days: number;
      at_risk_tasks: number;
      blocked_tasks: number;
    };
  };
}

export interface MemoryCard {
  app_metadata: AppMetadata;
  project: Project;
  personas: Record<PersonaType, PersonaDef>;
  sprints: Sprint[];
  performance_analytics: PerformanceAnalytics;
  decisions_log: DecisionLogEntry[];
  export_history: any[];
}

export const INITIAL_PERSONAS: Record<PersonaType, PersonaDef> = {
  software_engineer: {
    id: 'software_engineer',
    name: 'Engenheiro de Software',
    expertise: 'Arquitetura, performance, qualidade de código',
    tone: 'Técnico, orientado a métricas',
    focus_areas: ['Performance', 'Escalabilidade', 'Code quality', 'Technical debt'],
    metrics_priority: ['Tempo de execução', 'Cobertura de testes', 'Complexidade']
  },
  lawyer: {
    id: 'lawyer',
    name: 'Especialista Jurídico',
    expertise: 'Gestão de processos e conformidade',
    tone: 'Formal, orientado a prazos',
    focus_areas: ['Prazos', 'Documentação legal', 'Compliance', 'Risk management'],
    metrics_priority: ['Conformidade', 'Tempo de resposta', 'Documentação completa']
  }
};