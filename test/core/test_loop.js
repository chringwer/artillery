'use strict';

const { test } = require('tap');
const runner = require('../../core').runner;
const L = require('lodash');

const { SSMS } = require('../../core/lib/ssms');

test('simple loop', (t) => {
  const script = require('./scripts/loop.json');

  runner(script).then(function (ee) {
    ee.on('done', (nr) => {
      const report = SSMS.legacyReport(nr).report();

      let scenarios = report.scenariosCompleted;
      let requests = report.requestsCompleted;
      let loopCount = script.scenarios[0].flow[0].count;
      let expected = scenarios * loopCount * 2;
      t.ok(
        requests === expected,
        'Should have ' + expected + ' requests for each completed scenario'
      );
      ee.stop().then(() => {
        t.end();
      });
    });
    ee.run();
  });
});

test('loop with range', (t) => {
  const script = require('./scripts/loop_range.json');

  runner(script).then(function (ee) {
    ee.on('done', (nr) => {
      const report = SSMS.legacyReport(nr).report();

      let scenarios = report.scenariosCompleted;
      let requests = report.requestsCompleted;
      let expected = scenarios * 3 * 2;
      let code200 = report.codes[200];
      let code404 = report.codes[404];

      t.ok(
        requests === expected,
        'Should have ' + expected + ' requests for each completed scenario'
      );
      t.ok(code200 > 0, 'There should be a non-zero number of 200s');

      // If $loopCount breaks, we'll see 404s here.
      t.ok(!code404, 'There should be no 404s');
      ee.stop().then(() => {
        t.end();
      });
    });
    ee.run();
  });
});

test('loop with nested range', (t) => {
  const script = require('./scripts/loop_nested_range.json');

  runner(script).then(function (ee) {
    ee.on('done', (nr) => {
      const report = SSMS.legacyReport(nr).report();

      let scenarios = report.scenariosCompleted;
      let requests = report.requestsCompleted;
      let expected = scenarios * 3 * 2;
      let code200 = report.codes[200];
      let code404 = report.codes[404];

      t.ok(
        requests === expected,
        'Should have ' + expected + ' requests for each completed scenario'
      );
      t.ok(code200 > 0, 'There should be a non-zero number of 200s');

      // If $loopCount breaks, we'll see 404s here.
      t.ok(!code404, 'There should be no 404s');
      ee.stop().then(() => {
        t.end();
      });
    });
    ee.run();
  });
});
