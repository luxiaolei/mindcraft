import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const compose = readFileSync(new URL('../compose.yaml', import.meta.url), 'utf8');
const profile = JSON.parse(readFileSync(new URL('../english-buddy.json', import.meta.url), 'utf8'));
const env = readFileSync(new URL('../../.env.poc.example', import.meta.url), 'utf8');

test('offline-mode server and admin ports only bind loopback', () => {
  assert.match(compose, /ONLINE_MODE:\s*"FALSE"/);
  assert.match(compose, /127\.0\.0\.1:25565:25565/);
  assert.match(compose, /127\.0\.0\.1:8080:8080/);
});
test('EULA must be opted into explicitly', () => {
  assert.match(env, /^MINECRAFT_EULA=FALSE/m);
  assert.match(compose, /MINECRAFT_EULA:-FALSE/);
});
test('Mindcraft code execution and combat disabled in PoC', () => {
  assert.match(compose, /"allow_insecure_coding":false/);
  for (const cmd of ['!newAction','!attack','!attackPlayer','!setMode']) {
    assert.ok(compose.includes(JSON.stringify(cmd)), cmd);
  }
});
test('Buddy profile is restricted to observed game data and short English', () => {
  assert.equal(profile.name, 'Buddy');
  assert.match(profile.conversing,/short, patient English sentences/);
  assert.match(profile.conversing,/Never claim to see the child's interface/);
});
