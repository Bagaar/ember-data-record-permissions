/* eslint-disable ember/no-new-mixins */

import SerializerMixin from '@bagaaravel/ember-data-record-permissions/mixins/serializer'
import JSONAPIAdapter from 'ember-data/adapters/json-api'
import JSONAPISerializer from 'ember-data/serializers/json-api'
import attr from 'ember-data/attr'
import Model from 'ember-data/model'
import { belongsTo } from 'ember-data/relationships'
import { setupTest } from 'ember-qunit'
import { module, test } from 'qunit'

const UserSerializer = JSONAPISerializer.extend(SerializerMixin)

const UserModel = Model.extend({
  email: attr(),
  firstName: attr(),
  lastName: attr(),
  password: attr(),
  project: belongsTo()
})

module('Unit | Mixin | serializer', function (hooks) {
  setupTest(hooks)

  test('it normalizes record permissions from a single response', async function (assert) {
    let UserAdapter = JSONAPIAdapter.extend({
      ajax () {
        return {
          data: {
            id: '1',
            type: 'users',
            meta: {
              permissions: {
                attributes: {
                  email: 'r',
                  'first-name': 'rw',
                  password: ''
                },
                relationships: {
                  project: 'r'
                }
              }
            }
          }
        }
      }
    })

    this.owner.register('adapter:user', UserAdapter)
    this.owner.register('serializer:user', UserSerializer)
    this.owner.register('model:user', UserModel)

    let store = this.owner.lookup('service:store')
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    await store.findRecord('user', 1)

    assert.ok(recordPermissionsService.canRead('email', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('email', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('firstName', 'user', '1'))
    assert.ok(recordPermissionsService.canWrite('firstName', 'user', '1'))

    assert.notOk(recordPermissionsService.canRead('password', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('password', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('project', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('project', 'user', '1'))
  })

  test('it normalizes record permissions from an array response', async function (assert) {
    let UserAdapter = JSONAPIAdapter.extend({
      ajax () {
        return {
          data: [
            {
              id: '1',
              type: 'users',
              meta: {
                permissions: {
                  attributes: {
                    email: 'r'
                  }
                }
              }
            },
            {
              id: '2',
              type: 'users',
              meta: {
                permissions: {
                  attributes: {
                    email: 'rw'
                  }
                }
              }
            }
          ]
        }
      }
    })

    this.owner.register('adapter:user', UserAdapter)
    this.owner.register('serializer:user', UserSerializer)
    this.owner.register('model:user', UserModel)

    let store = this.owner.lookup('service:store')
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    await store.findAll('user')

    assert.ok(recordPermissionsService.canRead('email', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('email', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('email', 'user', '2'))
    assert.ok(recordPermissionsService.canWrite('email', 'user', '2'))
  })

  test('it normalizes record permissions from included records', async function (assert) {
    let UserAdapter = JSONAPIAdapter.extend({
      ajax () {
        return {
          data: [],
          included: [
            {
              id: '1',
              type: 'users',
              meta: {
                permissions: {
                  attributes: {
                    email: 'r'
                  }
                }
              }
            },
            {
              id: '2',
              type: 'users',
              meta: {
                permissions: {
                  attributes: {
                    email: 'rw'
                  }
                }
              }
            }
          ]
        }
      }
    })

    this.owner.register('adapter:user', UserAdapter)
    this.owner.register('serializer:user', UserSerializer)
    this.owner.register('model:user', UserModel)

    let store = this.owner.lookup('service:store')
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    await store.findAll('user')

    assert.ok(recordPermissionsService.canRead('email', 'user', '1'))
    assert.notOk(recordPermissionsService.canWrite('email', 'user', '1'))

    assert.ok(recordPermissionsService.canRead('email', 'user', '2'))
    assert.ok(recordPermissionsService.canWrite('email', 'user', '2'))
  })
})
