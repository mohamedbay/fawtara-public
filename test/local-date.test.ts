import test from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentDate } from '../src/app/utils/dateUtils.ts';

for (const scenario of [
  { zone: 'Africa/Tripoli', now: '2026-10-17T22:30:00Z', expected: '2026-10-18' },
  { zone: 'America/Los_Angeles', now: '2026-01-01T01:30:00Z', expected: '2025-12-31' },
  { zone: 'Asia/Kolkata', now: '2028-02-29T19:00:00Z', expected: '2028-03-01' },
]) {
  test(`invoice date follows the local calendar in ${scenario.zone}`, (context) => {
    const previousZone = process.env.TZ;
    process.env.TZ = scenario.zone;
    context.mock.timers.enable({ apis: ['Date'], now: new Date(scenario.now) });
    try {
      assert.equal(getCurrentDate(), scenario.expected);
    } finally {
      if (previousZone === undefined) delete process.env.TZ;
      else process.env.TZ = previousZone;
    }
  });
}
