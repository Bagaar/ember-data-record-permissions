import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import Model from 'ember-data/model'
import { test } from 'qunit'

export default function () {
  test('"setModelPermissions" throws when the provided arguments are invalid', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    assert.throws(() => {
      recordPermissionsService.setModelPermissions()
    })

    assert.throws(() => {
      recordPermissionsService.setModelPermissions('non-existing-model-name')
    })

    assert.throws(() => {
      recordPermissionsService.setModelPermissions('user')
    })

    recordPermissionsService.setModelPermissions('user', {})
  })

  test('it sets model permissions', function (assert) {
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)
    this.owner.register('model:project', Model)

    recordPermissionsService.setModelPermissions('user', {
      firstName: PERMISSIONS.READ | PERMISSIONS.WRITE
    })

    assert.ok(recordPermissionsService.canRead('firstName', 'user'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user'))

    recordPermissionsService.setModelPermissions('project', {
      name: PERMISSIONS.READ | PERMISSIONS.WRITE
    })

    assert.ok(recordPermissionsService.canRead('firstName', 'user'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user'))

    assert.ok(recordPermissionsService.canRead('name', 'project'))
    assert.ok(recordPermissionsService.canWrite('name', 'project'))
  })
}
