import { setupTest } from 'ember-qunit'
import { module } from 'qunit'

import runSetModelPermissionsTest from './set-model-permissions-test'
import runSetRecordPermissionsTest from './set-record-permissions-test'
import runCanReadTest from './can-read-test'
import runCanWriteTest from './can-write-test'

module('Unit | Service | record-permissions', function (hooks) {
  setupTest(hooks)

  runSetModelPermissionsTest()
  runSetRecordPermissionsTest()
  runCanReadTest()
  runCanWriteTest()
})
