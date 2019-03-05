import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import { EVENT } from '@bagaaravel/ember-data-record-permissions/config'
import { getOwner } from '@ember/application'
import { assert } from '@ember/debug'
import { sendEvent } from '@ember/object/events'
import Service from '@ember/service'
import { typeOf } from '@ember/utils'

export default Service.extend({
  /**
   * State
   */

  modelPermissions: null,
  recordPermissions: null,

  /**
   * Hooks
   */

  init () {
    this._super(...arguments)

    this.modelPermissions = {}
    this.recordPermissions = {}
  },

  /**
   * Methods
   */

  setModelPermissions (modelName, permissions) {
    assert(
      assertMessage('The "modelName" argument should be a string.'),
      typeOf(modelName) === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "permissions" argument should be an object.'),
      typeOf(permissions) === 'object'
    )

    let modelPermissions = {
      ...this.modelPermissions,
      [modelName]: permissions
    }

    this.set('modelPermissions', modelPermissions)

    sendEvent(this, EVENT.MODEL_PERMISSIONS_CHANGED, [modelName])
  },

  setRecordPermissions (modelName, recordId, permissions) {
    assert(
      assertMessage('The "modelName" argument should be a string.'),
      typeOf(modelName) === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "recordId" argument should be a string.'),
      typeOf(recordId) === 'string'
    )

    assert(
      assertMessage('The "permissions" argument should be an object.'),
      typeOf(permissions) === 'object'
    )

    let recordPermissions = {
      ...this.recordPermissions,
      [modelName]: {
        ...this.recordPermissions[modelName],
        [recordId]: permissions
      }
    }

    this.set('recordPermissions', recordPermissions)

    sendEvent(this, EVENT.RECORD_PERMISSIONS_CHANGED, [modelName, recordId])
  },

  canRead (fieldName, modelName, recordId) {
    return this.can({
      permission: PERMISSIONS.READ,
      fieldName,
      modelName,
      recordId
    })
  },

  canWrite (fieldName, modelName, recordId) {
    return this.can({
      permission: PERMISSIONS.WRITE,
      fieldName,
      modelName,
      recordId
    })
  },

  can ({ permission, fieldName, modelName, recordId }) {
    assert(
      assertMessage('The "fieldName" argument should be a string.'),
      typeOf(fieldName) === 'string'
    )

    assert(
      assertMessage('The "modelName" argument should be a string.'),
      typeOf(modelName) === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "recordId" argument should be a string.'),
      typeOf(recordId) === 'undefined' || typeOf(recordId) === 'string'
    )

    if (recordId) {
      let fieldRecordPermissions = this.getFieldRecordPermissions(
        modelName,
        recordId,
        fieldName
      )

      if (typeOf(fieldRecordPermissions) === 'number') {
        return Boolean(fieldRecordPermissions & permission)
      }
    }

    let fieldModelPermissions = this.getFieldModelPermissions(
      modelName,
      fieldName
    )

    if (typeOf(fieldModelPermissions) === 'number') {
      return Boolean(fieldModelPermissions & permission)
    }

    assert(
      assertMessage(
        'Read and write permissions should be defined before validating them.'
      )
    )
  },

  getFieldModelPermissions (modelName, fieldName) {
    return (
      this.modelPermissions[modelName] &&
      this.modelPermissions[modelName][fieldName]
    )
  },

  getFieldRecordPermissions (modelName, recordId, fieldName) {
    return (
      this.recordPermissions[modelName] &&
      this.recordPermissions[modelName][recordId] &&
      this.recordPermissions[modelName][recordId][fieldName]
    )
  }
})

function assertMessage (message) {
  return `@bagaaravel/ember-data-record-permissions: ${message}`
}
