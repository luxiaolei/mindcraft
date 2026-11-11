/**
 * Standalone learning-policy spike. Not wired into live Mindcraft / Minecraft yet.
 * This module deliberately does not infer a child's aptitude from game logs or ASR.
 */

const ACTIONS = new Set(['stop', 'describe', 'follow_player', 'search_for_block']);
const SAFE_LOGS = new Set(['oak_log', 'birch_log', 'spruce_log']);
const PLAYER_NAME = /^[A-Za-z0-9_]{3,16}$/;

/**
 * Only the first distinct task opportunity counts toward "independent" evidence.
 * The caller MUST supply an authorized learnerId. AI actions never count.
 */
export function summarizeSkill(events, skillId, learnerId) {
  if (!Array.isArray(events)) throw new TypeError('events must be an array');
  if (!skillId || !learnerId) throw new Error('skillId and learnerId are required');
  const seenEvents = new Set();
  const firstByTask = new Map();
  for (const e of events) {
    if (!e || e.actorId !== learnerId || e.skillId !== skillId ||
        !e.eventId || !e.taskId || seenEvents.has(e.eventId)) continue;
    seenEvents.add(e.eventId);
    if (!firstByTask.has(e.taskId)) firstByTask.set(e.taskId, e);
  }
  const firsts = [...firstByTask.values()];
  const independent = firsts.filter(
    e => e.firstAttempt === true && e.outcome === 'success' && e.assistance === 'none'
  );
  const supported = firsts.filter(
    e => e.outcome === 'success' && e.assistance !== 'none'
  );
  const state = independent.length >= 2 ? 'cross_task_independence_evidence'
    : independent.length === 1 ? 'emerging_evidence'
    : supported.length > 0 ? 'completed_with_help'
    : 'insufficient_evidence';
  return {
    state, independentTaskCount: independent.length,
    supportedTaskCount: supported.length,
    countedTaskIds: firsts.map(e => e.taskId),
    evidenceEventIds: firsts.map(e => e.eventId)
  };
}

/**
 * A small deterministic UX fallback, not a trained lesson assessment.
 * Suggested actions must be confirmed/validated by an independent game adapter.
 */
export function planTeachingTurn({
  goal = 'collect_wood', level = 'starter', observedNearbyBlocks = [],
  helpRequest = false, stopRequested = false
} = {}) {
  if (stopRequested) {
    return { stage: 'stop', utterance: "Okay, I'll stop.", suggestedAction: { type: 'stop' } };
  }
  const safeLevel = ['starter', 'builder', 'advanced'].includes(level) ? level : 'starter';
  if (goal === 'collect_wood') {
    const visibleLog = observedNearbyBlocks.find(b => SAFE_LOGS.has(b));
    if (visibleLog) {
      const utterance = safeLevel === 'advanced'
        ? "I can see logs nearby. How would you gather them efficiently?"
        : safeLevel === 'builder'
          ? "I found a tree nearby. Can you collect one log?"
          : "I see a tree! Can you get one log?";
      return { stage: 'guide', utterance, observed: visibleLog, suggestedAction: { type: 'describe' } };
    }
    return {
      stage: 'explore',
      utterance: helpRequest
        ? "I can't see a tree nearby. Let's look for one together."
        : "Let's explore. Can you find a tree?",
      observed: null,
      suggestedAction: helpRequest ? { type: 'search_for_block', block: 'oak_log' } : { type: 'describe' }
    };
  }
  if (goal === 'build_shelter') {
    return { stage: 'guide',
      utterance: safeLevel === 'advanced'
        ? 'How might we keep this shelter safe? Tell me your plan.'
        : 'Where should we put our first wall?',
      suggestedAction: { type: 'describe' } };
  }
  return { stage: 'invite', utterance: 'What shall we make together?', suggestedAction: { type: 'describe' } };
}

export function validateCandidateAction(candidate) {
  if (!candidate || typeof candidate !== 'object' || !ACTIONS.has(candidate.type)) return false;
  switch (candidate.type) {
    case 'stop':
    case 'describe': return Object.keys(candidate).length === 1;
    case 'follow_player':
      return Object.keys(candidate).length === 2 &&
        typeof candidate.player === 'string' && PLAYER_NAME.test(candidate.player);
    case 'search_for_block':
      return Object.keys(candidate).length === 2 &&
        typeof candidate.block === 'string' && SAFE_LOGS.has(candidate.block);
    default: return false;
  }
}
