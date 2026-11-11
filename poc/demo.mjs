import { planTeachingTurn, summarizeSkill, validateCandidateAction } from './lesson-core.mjs';

const demo = planTeachingTurn({
  goal: 'collect_wood',
  level: 'starter',
  observedNearbyBlocks: ['oak_log', 'grass_block'],
  helpRequest: true
});
const skill = summarizeSkill([
  { eventId:'evt-1', taskId:'tree-1', actorId:'test-child', skillId:'resource_identification',
    firstAttempt:true, outcome:'success', assistance:'hint' },
  { eventId:'evt-2', taskId:'tree-2', actorId:'test-child', skillId:'resource_identification',
    firstAttempt:true, outcome:'success', assistance:'none' }
], 'resource_identification', 'test-child');
console.log(JSON.stringify({ demo, actionIsAllowed: validateCandidateAction(demo.suggestedAction), skill }, null, 2));
