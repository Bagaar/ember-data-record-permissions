import attr from 'ember-data/attr'
import Model from 'ember-data/model'
import { belongsTo } from 'ember-data/relationships'
import { test } from 'qunit'

const UserModel = Model.extend({
  email: attr(),
  firstName: attr(),
  lastName: attr(),
  password: attr(),
  project: belongsTo()
})

export default function () {
  test('it extracts record permissions from a payload', function (assert) {
    let payload = {
      id: '1',
      type: 'users',
      meta: {
        permissions: {
          attributes: {
            email: 'r',
            'first-name': 'rw',
            'last-name': 'rw',
            password: ''
          },
          relationships: {
            project: 'r'
          }
        }
      }
    }

    this.owner.register('model:user', UserModel)

    let storeService = this.owner.lookup('service:store')
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    recordPermissionsService.extractRecordPermissions(
      storeService.modelFor('user'),
      payload
    )

    assert.ok(recordPermissionsService.canRead('email', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('email', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('firstName', 'user', '1'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('lastName', 'user', '1'))
    assert.ok(recordPermissionsService.canWrite('lastName', 'user', '1'))

    assert.notOk(recordPermissionsService.canRead('password', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('password', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('project', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('project', 'user', '1'))
  })
}
