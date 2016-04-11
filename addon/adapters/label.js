import Ember from 'ember';
import { default as TrelloBaseAdapter } from './base';
import { default as TrelloAdapterError } from './errors';

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
export default TrelloBaseAdapter.extend({
  namespace: '1/labels',
  buildURL: function(modelName, id, snapshot, requestType, query) {
    const baseUrl     = `${this.get('host')}/${this.get('namespace')}`;
    const token       = this.trelloAuth.get('token');
    const key         = this.trelloAuth.get('key');
    const authParams  = `?key=${key}&token=${token}`;
    let url           = null;

    if(!token || !key) {
      Ember.logger.error(TrelloAdapterError.NOT_AUTHORIZED);
      throw new Error(TrelloAdapterError.NOT_AUTHORIZED);
    }

    switch (requestType) {
      case 'findAll':
        /* TODO: findAll won't work, use query instead */
        url = url + '?key=' + key + '&token=' + token;
        break;
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
      default:
        Ember.logger.error(TrelloAdapterError.BAD_REQUEST_TYPE);
        throw new Error(TrelloAdapterError.BAD_REQUEST_TYPE);
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
    let id          = Ember.get(record, 'id');
    let attributes  = Ember.get(record, '_attributes');
    let params      = {};
    let url         = null;
    let data        = null;

    params.name     = Ember.get(attributes, 'name');
    params.color    = Ember.get(attributes, 'color');

    data            = this._processAttributes(params);

    url             = this.buildURL(type.typeKey, id,
                                    record, "updateRecord", data);

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
    let params      = {};
    let data        = null;
    let url         = null;

    params.name     = Ember.get(attributes, 'name');
    params.color    = Ember.get(attributes, 'color');
    params.idBoard  = Ember.get(attributes, 'idBoard');

    data            = this._processAttributes(params);

    url             = this.buildURL(type.typeKey, null,
                                    record, 'createRecord', data);

    return this._ajax(url, data, "POST");
  }
});
