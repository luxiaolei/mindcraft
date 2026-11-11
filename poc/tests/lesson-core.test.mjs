import test from 'node:test';
import assert from 'node:assert/strict';
import { planTeachingTurn, summarizeSkill, validateCandidateAction } from '../lesson-core.mjs';

const event = (id, task, actor='child', assistance='none', outcome='success', firstAttempt=true) =>
  ({eventId:id, taskId:task, actorId:actor, skillId:'resources',
    assistance, outcome, firstAttempt});

test('only child events count, never bot actions', () => {
  const r = summarizeSkill([event('1','t1','Buddy'),event('2','t2','child')], 'resources','child');
  assert.equal(r.independentTaskCount, 1);
  assert.deepEqual(r.countedTaskIds, ['t2']);
});

test('two independent tasks provide cross-task evidence', () => {
  const r = summarizeSkill([event('1','t1'),event('2','t2')], 'resources','child');
  assert.equal(r.state,'cross_task_independence_evidence');
  assert.equal(r.independentTaskCount, 2);
});

test('repeated events or retries in one task do not inflate independent counts', () => {
  const r = summarizeSkill([
    event('1','t1','child','hint','success'),
    event('1','t1'),
    event('2','t1'),
    event('3','t2','child','none','success')
  ], 'resources','child');
  assert.equal(r.independentTaskCount, 1);
  assert.equal(r.supportedTaskCount, 1);
});

test('helped completion is not independent completion', () => {
  const r = summarizeSkill([event('1','t1','child','demonstration','success')], 'resources','child');
  assert.equal(r.state,'completed_with_help');
});

test('single failed task does not diagnose skill', () => {
  const r = summarizeSkill([event('1','t1','child','none','failed')], 'resources','child');
  assert.equal(r.state,'insufficient_evidence');
});

test('world observation is constrained to supplied nearby blocks', () => {
  const found = planTeachingTurn({ observedNearbyBlocks:['oak_log'], level:'starter' });
  const absent = planTeachingTurn({ observedNearbyBlocks:[], helpRequest:true });
  assert.match(found.utterance,/see a tree/i);
  assert.match(absent.utterance,/can't see a tree/i);
});

test('utterances adjust by level without claiming assessment', () => {
  const beginner = planTeachingTurn({observedNearbyBlocks:['birch_log'], level:'starter'});
  const advanced = planTeachingTurn({observedNearbyBlocks:['birch_log'], level:'advanced'});
  assert.notEqual(beginner.utterance, advanced.utterance);
});

test('stop request takes priority over a task', () => {
  const r = planTeachingTurn({stopRequested:true,observedNearbyBlocks:['oak_log']});
  assert.deepEqual(r.suggestedAction,{type:'stop'});
});

test('action allowlist rejects arbitrary code, combat, and malformed usernames', () => {
  assert.equal(validateCandidateAction({type:'stop'}),true);
  assert.equal(validateCandidateAction({type:'search_for_block',block:'oak_log'}),true);
  assert.equal(validateCandidateAction({type:'search_for_block',block:'tnt'}),false);
  assert.equal(validateCandidateAction({type:'run_code',script:'attack'}),false);
  assert.equal(validateCandidateAction({type:'follow_player',player:'two words'}),false);
  assert.equal(validateCandidateAction({type:'stop',command:'attack'}),false);
});

test('learner identity is always required', () => {
  assert.throws(() => summarizeSkill([], 'resources', ''),/required/);
});
