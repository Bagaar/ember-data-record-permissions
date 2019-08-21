import CanHelperBase from './can-helper-base'

export default CanHelperBase.extend({
  /**
   * Hooks
   */

  validatePermissions (fieldName, modelName, recordId) {
    return this.recordPermissionsService.canWrite(
      fieldName,
      modelName,
      recordId
    )
  }
})
