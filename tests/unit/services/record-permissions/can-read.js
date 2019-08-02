import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import Model from 'ember-data/model'
import { test } from 'qunit'

export default function () {
  test('"canRead" throws when the provided arguments are invalid', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.READ
    })

    assert.throws(() => {
      recordPermissionsService.canRead()
    })

    assert.throws(() => {
      recordPermissionsService.canRead('firstName')
    })

    assert.throws(() => {
      recordPermissionsService.canRead('firstName', 'non-existing-model-name')
    })

    recordPermissionsService.canRead('firstName', 'user')
  })

  test('it validates read permissions', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    // No model AND no record permissions set.
    assert.throws(() => {
      recordPermissionsService.canRead('firstName', 'user')
    })
    assert.throws(() => {
      recordPermissionsService.canRead('firstName', 'user', '1')
    })

    // ONLY model permissions set.
    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.NONE
    })
    assert.notOk(recordPermissionsService.canRead('firstName', 'user'))
    assert.notOk(recordPermissionsService.canRead('firstName', 'user', '1'))
    recordPermissionsService.set('modelPermissions', {})

    // ONLY record permissions set.
    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.NONE
    })
    assert.throws(() => {
      recordPermissionsService.canRead('firstName', 'user')
    })
    assert.notOk(recordPermissionsService.canRead('firstName', 'user', '1'))
    recordPermissionsService.set('recordPermissions', {})

    // Model AND record permissions set.
    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.NONE
    })
    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.READ
    })
    assert.notOk(recordPermissionsService.canRead('firstName', 'user'))
    assert.ok(recordPermissionsService.canRead('firstName', 'user', '1'))
  })
}
