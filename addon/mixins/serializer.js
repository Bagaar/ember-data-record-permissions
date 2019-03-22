/* eslint-disable ember/no-new-mixins */

import { PERMISSIONS } from '@bagaaravel/ember-data-record-permissions'
import Mixin from '@ember/object/mixin'
import { inject as service } from '@ember/service'

export default Mixin.create({
  /**
   * Services
   */

  recordPermissionsService: service('record-permissions'),

  /**
   * Hooks
   */

  normalize () {
    this.normalizePermissions(...arguments)

    return this._super(...arguments)
  },

  normalizePermissions (modelClass, payload) {
    let payloadPermissions = getPayloadPermissions(payload)

    if (Object.keys(payloadPermissions).length === 0) {
      return
    }

    let modelName = modelClass.modelName
    let recordId = payload.id
    let recordPermissions = {}

    modelClass.fields.forEach((kind, fieldName) => {
      let fieldKey

      if (kind === 'attribute') {
        fieldKey = this.keyForAttribute(fieldName)
      } else {
        fieldKey = this.keyForRelationship(fieldName)
      }

      let fieldPermissions = payloadPermissions[fieldKey]
      let hasFieldPermissions = typeof fieldPermissions === 'string'

      if (!hasFieldPermissions) {
        return
      }

      recordPermissions[fieldName] = getBitwisePermissions(fieldPermissions)
    })

    this.recordPermissionsService.setRecordPermissions(
      modelName,
      recordId,
      recordPermissions
    )
  }
})

function getPayloadPermissions (payload) {
  if (payload.meta && payload.meta.permissions) {
    return {
      ...payload.meta.permissions.attributes,
      ...payload.meta.permissions.relationships
    }
  }

  return {}
}

function getBitwisePermissions (stringPermissions) {
  let bitwisePermissions = PERMISSIONS.NONE

  if (stringPermissions.charAt(0) === 'r') {
    bitwisePermissions = PERMISSIONS.READ
  }

  if (stringPermissions.charAt(1) === 'w') {
    bitwisePermissions = bitwisePermissions | PERMISSIONS.WRITE
  }

  return bitwisePermissions
}
