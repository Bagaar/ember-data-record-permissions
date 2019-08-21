import { setupTest } from 'ember-qunit'
import { module } from 'qunit'

import runSetModelPermissionsTests from './set-model-permissions'
import runSetRecordPermissionsTests from './set-record-permissions'
import runCanReadTests from './can-read'
import runCanWriteTests from './can-write'
import runExtractRecordPermissionsTests from './extract-record-permissions'

module('Unit | Service | record-permissions', function (hooks) {
  setupTest(hooks)

  runSetModelPermissionsTests()
  runSetRecordPermissionsTests()
  runCanReadTests()
  runCanWriteTests()
  runExtractRecordPermissionsTests()
})
