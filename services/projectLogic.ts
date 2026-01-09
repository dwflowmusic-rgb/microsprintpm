import { MemoryCard, Sprint, MicroSprint, Task, Status, SprintSummary, ProjectType, INITIAL_PERSONAS } from '../types';

// Helper to generate IDs
export const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

export const createNewMemoryCard = (name: string, type: ProjectType, description: string, owner: string): MemoryCard => {
  const now = new Date().toISOString();
  return {
    app_metadata: {
      app_version: "1.0.0",
      created_at: now,
      last_modified: now,
      file_format_version: "1.0",
      compatibility: ["ai_studio", "antigravity", "standalone"]
    },
    project: {
      id: generateId('proj'),
      name,
      description,
      type,
      owner,
      created_at: now,
      active_persona: 'software_engineer'
    },
    personas: INITIAL_PERSONAS,
    sprints: [],
    performance_analytics: {
      macro_analysis: {
        overall_project_completion: 0,
        sprints_completed: 0,
        sprints_in_progress: 0,
        sprints_pending: 0,
        average_sprint_efficiency: 0,
        average_velocity: 0,
        estimated_completion_date: '',
        total_hours_invested: 0,
        total_hours_estimated_remaining: 0
      },
      micro_analysis: {}
    },
    decisions_log: [],
    export_history: []
  };
};

export const calculateCompletion = (card: MemoryCard): MemoryCard => {
  const newCard = { ...card, app_metadata: { ...card.app_metadata, last_modified: new Date().toISOString() } };
  
  // 1. Recalculate Micro Sprints
  newCard.sprints = newCard.sprints.map(sprint => {
    const updatedMicroSprints = sprint.micro_sprints.map(ms => {
      const totalTasks = ms.tasks.length;
      const completedTasks = ms.tasks.filter(t => t.status === 'completed').length;
      
      const completionPercentage = totalTasks === 0 ? (ms.status === 'completed' ? 100 : 0) : (completedTasks / totalTasks) * 100;
      
      const actualHours = ms.tasks.reduce((sum, t) => sum + (t.actual_hours || 0), 0);
      const estimatedHours = ms.tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);

      // Status update based on completion
      let status: Status = ms.status;
      if (totalTasks > 0) {
          if (completedTasks === totalTasks) status = 'completed';
          else if (completedTasks > 0) status = 'in_progress';
      }

      return {
        ...ms,
        completion_percentage: completionPercentage,
        actual_hours: actualHours,
        estimated_hours: estimatedHours, // Update estimates based on tasks
        status
      };
    });

    // 2. Recalculate Sprint
    const totalSprintCompletion = updatedMicroSprints.reduce((sum, ms) => {
      return sum + (ms.completion_percentage * ms.weight_in_sprint);
    }, 0);

    const sprintActualHours = updatedMicroSprints.reduce((sum, ms) => sum + ms.actual_hours, 0);
    const sprintEstHours = updatedMicroSprints.reduce((sum, ms) => sum + ms.estimated_hours, 0);
    const totalSprintTasks = updatedMicroSprints.reduce((sum, ms) => sum + ms.tasks.length, 0);
    const completedSprintTasks = updatedMicroSprints.reduce((sum, ms) => sum + ms.tasks.filter(t => t.status === 'completed').length, 0);

    const summary: SprintSummary = {
      total_micro_sprints: updatedMicroSprints.length,
      completed_micro_sprints: updatedMicroSprints.filter(ms => ms.completion_percentage === 100).length,
      total_tasks: totalSprintTasks,
      completed_tasks: completedSprintTasks,
      total_estimated_hours: sprintEstHours,
      total_actual_hours: sprintActualHours,
      efficiency_ratio: sprintEstHours > 0 ? sprintActualHours / sprintEstHours : 1, // < 1 means faster than estimated (technically usually we want 1 or slightly less)
      velocity: completedSprintTasks // Simple velocity calculation
    };

    let sprintStatus: Status = sprint.status;
    if (sprintStatus !== 'completed' && sprintStatus !== 'pending') {
        if (totalSprintCompletion >= 100) sprintStatus = 'completed';
        else if (totalSprintCompletion > 0) sprintStatus = 'in_progress';
    }

    return {
      ...sprint,
      micro_sprints: updatedMicroSprints,
      completion_percentage: Math.min(100, totalSprintCompletion),
      sprint_summary: summary,
      status: sprintStatus
    };
  });

  // 3. Recalculate Project (Macro)
  const totalSprints = newCard.sprints.length;
  const completedSprints = newCard.sprints.filter(s => s.status === 'completed').length;
  const inProgressSprints = newCard.sprints.filter(s => s.status === 'in_progress').length;
  
  let projectCompletion = 0;
  if (totalSprints > 0) {
      const activeSprint = newCard.sprints.find(s => s.status === 'in_progress');
      const sprintWeight = 100 / totalSprints;
      const completedContribution = completedSprints * sprintWeight;
      const activeContribution = activeSprint ? (activeSprint.completion_percentage / 100) * sprintWeight : 0;
      projectCompletion = completedContribution + activeContribution;
  }

  newCard.performance_analytics.macro_analysis = {
    ...newCard.performance_analytics.macro_analysis,
    overall_project_completion: parseFloat(projectCompletion.toFixed(1)),
    sprints_completed: completedSprints,
    sprints_in_progress: inProgressSprints,
    sprints_pending: newCard.sprints.filter(s => s.status === 'pending').length,
    total_hours_invested: newCard.sprints.reduce((sum, s) => sum + s.sprint_summary.total_actual_hours, 0),
    total_hours_estimated_remaining: newCard.sprints.reduce((sum, s) => sum + (s.sprint_summary.total_estimated_hours - s.sprint_summary.total_actual_hours), 0) // Simplified
  };

  // Micro analysis update
  const currentSprint = newCard.sprints.find(s => s.status === 'in_progress') || newCard.sprints.find(s => s.status === 'pending');
  if (currentSprint) {
    newCard.performance_analytics.micro_analysis = {
      current_sprint: {
        sprint_id: currentSprint.id,
        completion: currentSprint.completion_percentage,
        current_velocity: currentSprint.sprint_summary.velocity,
        estimated_remaining_days: 0, // Would need complex calc
        at_risk_tasks: 0, // Placeholder
        blocked_tasks: currentSprint.micro_sprints.reduce((sum, ms) => sum + ms.tasks.filter(t => t.status === 'blocked').length, 0)
      }
    };
    newCard.project.current_sprint = currentSprint.id;
  }

  return newCard;
};
