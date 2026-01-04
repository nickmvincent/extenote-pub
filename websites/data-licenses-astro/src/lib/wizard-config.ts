/**
 * Wizard Configuration
 * ====================
 * This file centralizes all configurable aspects of the license preference wizard.
 * Update this file when:
 * - Adding new goals, content types, or pipeline stages
 * - Changing how goals map to initiative actions
 * - Adjusting scoring weights for recommendations
 * - Adding new preference options
 */

// =============================================================================
// GOALS
// =============================================================================
// These are the high-level objectives users can select in Step 1.
// Each goal maps to one or more initiative "actionsSupported" values.

export interface Goal {
  id: string;
  icon: string;
  label: string;
  hint: string;
  /** Which initiative actions this goal maps to (from content.config.ts actionsSupported enum) */
  mapsToActions: string[];
}

export const goals: Goal[] = [
  {
    id: 'express-preference',
    icon: '📢',
    label: 'Express my preferences',
    hint: 'Tell AI companies how I want my work used',
    mapsToActions: ['attach-preference-signal', 'attach-formal-license'],
  },
  {
    id: 'block-scraping',
    icon: '🛡️',
    label: 'Block AI scraping',
    hint: 'Prevent bots from collecting my content',
    mapsToActions: ['technical-blocking'],
  },
  {
    id: 'get-compensated',
    icon: '💰',
    label: 'Get compensated',
    hint: 'License my work or get paid for AI use',
    mapsToActions: ['add-tollgate', 'join-licensing-collective'],
  },
  {
    id: 'track-usage',
    icon: '📊',
    label: 'Track how my data is used',
    hint: 'Know when and how AI systems use my content',
    mapsToActions: ['new-infrastructures', 'attach-preference-signal'],
  },
  {
    id: 'collective-action',
    icon: '🤝',
    label: 'Join collective action',
    hint: 'Pool rights with other creators for leverage',
    mapsToActions: ['join-licensing-collective', 'certification'],
  },
  {
    id: 'verify-compliance',
    icon: '✅',
    label: 'Verify AI compliance',
    hint: 'Ensure AI companies follow my terms',
    mapsToActions: ['certification', 'new-infrastructures'],
  },
];

// =============================================================================
// CONTENT TYPES
// =============================================================================
// Types of content users might create. Currently used for UX personalization
// but could be extended to influence recommendations (e.g., image-specific tools).

export interface ContentType {
  id: string;
  icon: string;
  label: string;
  /** Optional: specific actions or initiatives particularly relevant to this content type */
  relevantActions?: string[];
}

export const contentTypes: ContentType[] = [
  { id: 'website', icon: '🌐', label: 'Website / Blog' },
  { id: 'articles', icon: '📰', label: 'News / Articles' },
  { id: 'code', icon: '💻', label: 'Code / Software' },
  { id: 'images', icon: '🖼️', label: 'Images / Art' },
  { id: 'music', icon: '🎵', label: 'Music / Audio' },
  { id: 'video', icon: '🎬', label: 'Video' },
  { id: 'academic', icon: '📚', label: 'Academic / Research' },
  { id: 'books', icon: '📖', label: 'Books / Long-form' },
  { id: 'social', icon: '📱', label: 'Social Media' },
  { id: 'data', icon: '🗃️', label: 'Datasets / APIs' },
];

// =============================================================================
// PIPELINE STAGES
// =============================================================================
// Stages in the AI pipeline where data rights matter.
// These should match the pipelineStages enum in content.config.ts.

export interface PipelineStage {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export const pipelineStages: PipelineStage[] = [
  { id: 'collect', icon: '🕷️', label: 'Collect / Scrape', description: 'Web crawlers gathering content' },
  { id: 'train', icon: '🧠', label: 'Train', description: 'Pre-training foundation models' },
  { id: 'fine-tune', icon: '🎯', label: 'Fine-tune', description: 'Adapting models for specific tasks' },
  { id: 'retrieve', icon: '🔍', label: 'Retrieve', description: 'RAG and search augmentation' },
  { id: 'generate', icon: '✨', label: 'Generate', description: 'Output and attribution' },
];

// =============================================================================
// PREFERENCE OPTIONS
// =============================================================================
// User preference choices that affect recommendation scoring.

export interface PreferenceOption {
  id: string;
  icon: string;
  label: string;
  hint: string;
}

export interface PreferenceGroup {
  id: string;
  title: string;
  options: PreferenceOption[];
}

export const preferenceGroups: PreferenceGroup[] = [
  {
    id: 'enforcement',
    title: 'Enforcement style',
    options: [
      { id: 'soft', icon: '🕊️', label: 'Soft / Opt-out signals', hint: 'Request compliance, rely on good faith' },
      { id: 'hard', icon: '🔒', label: 'Hard / Technical enforcement', hint: 'Block access, require authentication' },
      { id: 'both', icon: '⚖️', label: 'Both / Layered approach', hint: 'Signals plus technical measures' },
    ],
  },
  {
    id: 'techResources',
    title: 'Technical resources',
    options: [
      { id: 'minimal', icon: '📄', label: 'Minimal', hint: 'Just need to add a file or header' },
      { id: 'moderate', icon: '⚙️', label: 'Moderate', hint: 'Can configure server or use third-party tools' },
      { id: 'advanced', icon: '🛠️', label: 'Advanced', hint: 'Full control over infrastructure' },
    ],
  },
  {
    id: 'readiness',
    title: 'Readiness preference',
    options: [
      { id: 'usable-now', icon: '✅', label: 'Usable now', hint: 'Only show tools I can use today' },
      { id: 'include-wip', icon: '🔮', label: 'Include emerging', hint: 'Show work-in-progress options too' },
    ],
  },
];

// =============================================================================
// SCORING WEIGHTS
// =============================================================================
// Adjust these to change how heavily different factors influence recommendations.

export const scoringWeights = {
  /** Points per matching action (goal → action match) */
  actionMatch: 3,

  /** Points per matching pipeline stage */
  pipelineStageMatch: 2,

  /** Base points for any usable (non-WIP) initiative */
  usableBase: 2,

  /** Bonus for "usable-with-some-evidence" */
  someEvidenceBonus: 1,

  /** Bonus for "usable-with-strong-evidence" */
  strongEvidenceBonus: 2,

  /** Bonus for enforcement style match */
  enforcementMatch: 1,

  /** Bonus for technical complexity match */
  techResourcesMatch: 1,
};

// =============================================================================
// HELPER: Build goal-to-actions lookup
// =============================================================================

export function getGoalToActionsMap(): Record<string, string[]> {
  return Object.fromEntries(goals.map((g) => [g.id, g.mapsToActions]));
}

// =============================================================================
// ACTION CLASSIFICATIONS
// =============================================================================
// Classify actions for enforcement style matching.

export const actionClassifications = {
  /** Actions that represent "soft" enforcement (signals, opt-out) */
  soft: ['attach-preference-signal', 'attach-formal-license'],

  /** Actions that represent "hard" enforcement (technical measures) */
  hard: ['technical-blocking', 'add-tollgate'],

  /** Actions that work well with minimal technical resources */
  minimalTech: ['attach-preference-signal'],

  /** Actions that require advanced technical resources */
  advancedTech: ['technical-blocking', 'new-infrastructures'],
};
