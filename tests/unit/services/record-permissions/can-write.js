import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import Model from 'ember-data/model'
import { test } from 'qunit'

export default function () {
  test('"canWrite" throws when the provided arguments are invalid', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.READ | PERMISSIONS.WRITE
    })

    assert.throws(() => {
      recordPermissionsService.canWrite()
    })

    assert.throws(() => {
      recordPermissionsService.canWrite('firstName')
    })

    assert.throws(() => {
      recordPermissionsService.canWrite('firstName', 'non-existing-model-name')
    })

    recordPermissionsService.canWrite('firstName', 'user')
  })

  test('it validates write permissions', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    // No model AND no record permissions set.
    assert.throws(() => {
      recordPermissionsService.canWrite('firstName', 'user')
    })
    assert.throws(() => {
      recordPermissionsService.canWrite('firstName', 'user', '1')
    })

    // ONLY model permissions set.
    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.READ
    })
    assert.notOk(recordPermissionsService.canWrite('firstName', 'user'))
    assert.notOk(recordPermissionsService.canWrite('firstName', 'user', '1'))
    recordPermissionsService.set('modelPermissions', {})

    // ONLY record permissions set.
    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.READ
    })
    assert.throws(() => {
      recordPermissionsService.canWrite('firstName', 'user')
    })
    assert.notOk(recordPermissionsService.canWrite('firstName', 'user', '1'))
    recordPermissionsService.set('recordPermissions', {})

    // Model AND record permissions set.
    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.READ
    })
    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.READ | PERMISSIONS.WRITE
    })
    assert.notOk(recordPermissionsService.canWrite('firstName', 'user'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user', '1'))
  })
}
