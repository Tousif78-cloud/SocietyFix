import test from 'node:test';
import assert from 'node:assert/strict';
import { validateComplaint } from '../validators/complaint.validator.js';
import { validateEmail } from '../validators/auth.validator.js';
test('validates email format',()=>{assert.equal(validateEmail('resident@example.com'),true);assert.equal(validateEmail('not-an-email'),false);});
test('validates required complaint text',()=>{assert.ok(validateComplaint({title:'x',description:'short'}));assert.equal(validateComplaint({title:'Water leak',description:'Water is leaking near the kitchen sink'}),null);});
