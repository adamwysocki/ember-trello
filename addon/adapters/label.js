import Ember from 'ember';
import { default as TrelloBaseAdapater } from './base';

const NOT_AUTHORIZED_ERROR =
    "[Ember Trello] Not authorized. Invalid Trello token and/or key.";
const UNKNOWN_REQUEST_TYPE =
    "[Ember Trello] Unknown request type for buildURL.";
const FINDALL_NOT_SUPPORTED =
    "[Ember Trello] findAll is not supported for the label Model.";
const QUERY_NOT_SUPPORTED =
    "[Ember Trello] query is not supported for the label Model.";

/**
 * The Trello REST Framework adapter allows your store to communicate
 * with Trello APIs by adjusting the JSON and URL structure implemented
 * by Ember Data to match that of the Trello API.
 *
 *
 * @class TrelloLabelAdapter
 * @constructor
 * @extends TrelloBaseAdapter
 */
 export default TrelloBaseAdapater.extend({
  namespace: '1/labels',
  /****************************************************************************
   * Override buildURL.
   *
   * @param modelName {String}
   * @param id {Number}
   * @param snapshot {DS.Snapshot}
   * @param requestType {String}
   * @param query {Object}
   * @return url {String}
   */
  buildURL: function(modelName, id, snapshot, requestType, query) {
    const baseUrl     = `${this.get('host')}/${this.get('namespace')}`;
    const token       = this.trelloAuth.get('token');
    const key         = this.trelloAuth.get('key');
    const authParams  = `?key=${key}&token=${token}`;
    let url           = null;

    if(!token || !key) {
      console.error(NOT_AUTHORIZED_ERROR);
      throw new Error(NOT_AUTHORIZED_ERROR);
    }

    switch (requestType) {
      case 'findAll':
        Ember.logger.error(FINDALL_NOT_SUPPORTED);
        throw new Error(FINDALL_NOT_SUPPORTED);
      case 'deleteRecord':
      case 'findRecord':
      case 'updateRecord':
        url = `${baseUrl}/${id}${authParams}`;
        break;
      case 'createRecord':
        url = `${baseUrl}${authParams}`;
        break;
      case 'queryRecord':
        url = `${baseUrl}/${query.id}${authParams}`;
        break;
      case 'query':
        Ember.logger.error(QUERY_NOT_SUPPORTED);
        throw new Error(QUERY_NOT_SUPPORTED);
      default:
        Ember.logger.error(UNKNOWN_REQUEST_TYPE);
        throw new Error(UNKNOWN_REQUEST_TYPE);
    }

    return url;
  },
  /*******
   * Override updateRecord.
   *
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
   */
  updateRecord: function(store, type, record) {
    let attributes  = Ember.get(record, '_attributes');
    let id          = Ember.get(record, 'id');
    let data, url   = null;
    let params      = {};

    params.name     = Ember.get(attributes, 'name');
    params.color    = Ember.get(attributes, 'color');

    data            = this._processAttributes(params);

    url             = this.buildURL(type.typeKey, id,
                                    record, 'updateRecord', data);

    return this._ajax(url, data, "PUT");
  },
  /*******
   * Override createRecord
   *
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
   */
  createRecord: function(store, type, record) {
    let attributes  = Ember.get(record, '_attributes');
    let data, url   = null;
    let params      = {};

    params.name     = Ember.get(attributes, 'name');
    params.color    = Ember.get(attributes, 'color');
    params.idBoard  = Ember.get(attributes, 'idBoard');

    data            = this._processAttributes(params);

    url             = this.buildURL(type.typeKey, null,
                                    record, 'createRecord', data);

    return this._ajax(url, data, "POST");
  },
  /*******
   * Override deleteRecord
   *
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
   */
  deleteRecord: function(store, type, record) {
    let id              = Ember.get(record, 'id');
    let data, url       = null;

    url                 = this.buildURL(type.typeKey, id, record,
                                        "deleteRecord", data);

    return this._ajax(url, data, "DELETE");
  }
});
