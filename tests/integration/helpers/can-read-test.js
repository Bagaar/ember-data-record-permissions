import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import { render, settled } from '@ember/test-helpers'
import Model from 'ember-data/model'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'

module('Integration | Helper | can-read', function (hooks) {
  setupRenderingTest(hooks)

  test('it validates read permissions', async function (assert) {
    let storeService = this.owner.lookup('service:store')
    let recordPermissionsService = this.owner.lookup(
      'service:record-permissions'
    )

    this.owner.register('model:user', Model)

    let user = storeService.createRecord('user', { id: '1' })

    this.set('user', user)

    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.NONE
    })

    await render(hbs`{{can-read "firstName" this.user}}`)

    assert.dom().hasText('false')

    recordPermissionsService.setRecordPermissions('user', '1', {
      firstName: PERMISSIONS.READ
    })

    await settled()

    assert.dom().hasText('true')
  })
})
