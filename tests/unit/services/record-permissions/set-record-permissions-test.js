import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import Model from 'ember-data/model'
import { test } from 'qunit'

export default function () {
  test('"setRecordPermissions" throws when the provided arguments are invalid', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    assert.throws(() => {
      recordPermissionsService.setRecordPermissions()
    })

    assert.throws(() => {
      recordPermissionsService.setRecordPermissions('non-existing-model-name')
    })

    assert.throws(() => {
      recordPermissionsService.setRecordPermissions('user')
    })

    assert.throws(() => {
      recordPermissionsService.setRecordPermissions('user', '1')
    })

    recordPermissionsService.setRecordPermissions('user', '1', {})
  })

  test('it sets record permissions', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)
    this.owner.register('model:project', Model)

    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.READ | PERMISSIONS.WRITE
    })

    assert.ok(recordPermissionsService.canRead('firstName', 'user', '1'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user', '1'))

    recordPermissionsService.setRecordPermissions('project', '1', {
      name: PERMISSIONS.READ | PERMISSIONS.WRITE
    })

    assert.ok(recordPermissionsService.canRead('firstName', 'user', '1'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('name', 'project', '1'))
    assert.ok(recordPermissionsService.canWrite('name', 'project', '1'))
  })
}
