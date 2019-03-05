import { EVENT } from '@bagaaravel/ember-data-record-permissions/config'
import Helper from '@ember/component/helper'
import { addListener, removeListener } from '@ember/object/events'
import { bind } from '@ember/runloop'
import { inject as service } from '@ember/service'

export default Helper.extend({
  /**
   * Services
   */

  recordPermissionsService: service('record-permissions'),

  /**
   * State
   */

  modelName: '',
  recordId: '',

  /**
   * Life cycle
   */

  init () {
    this._super(...arguments)

    this.modelPermissionsChangedHandler = bind(
      this,
      this.modelPermissionsChangedHandler
    )

    this.recordPermissionsChangedHandler = bind(
      this,
      this.recordPermissionsChangedHandler
    )

    addListener(
      this.recordPermissionsService,
      EVENT.MODEL_PERMISSIONS_CHANGED,
      this.modelPermissionsChangedHandler
    )

    addListener(
      this.recordPermissionsService,
      EVENT.RECORD_PERMISSIONS_CHANGED,
      this.recordPermissionsChangedHandler
    )
  },

  willDestroy () {
    this._super(...arguments)

    removeListener(
      this.recordPermissionsService,
      EVENT.MODEL_PERMISSIONS_CHANGED,
      this.modelPermissionsChangedHandler
    )

    removeListener(
      this.recordPermissionsService,
      EVENT.RECORD_PERMISSIONS_CHANGED,
      this.recordPermissionsChangedHandler
    )
  },

  compute ([fieldName, record]) {
    this.cacheRecordProperties(record)

    return this.validatePermissions(fieldName, this.modelName, this.recordId)
  },

  /**
   * Handlers
   */

  modelPermissionsChangedHandler (modelName) {
    if (modelName === this.modelName) {
      this.recompute()
    }
  },

  recordPermissionsChangedHandler (modelName, recordId) {
    if (modelName === this.modelName && recordId === this.recordId) {
      this.recompute()
    }
  },

  /**
   * Methods
   */

  cacheRecordProperties (record) {
    this.modelName = record.constructor.modelName
    this.recordId = record.id
  }
})
