import DS from 'ember-data';
import Ember from 'ember';

const { RESTAdapter } = DS;
const { inject }      = Ember;

/**
 * The Trello REST Framework adapter allows your store to communicate
 * with Trello APIs by adjusting the JSON and URL structure implemented
 * by Ember Data to match that of the Trello API.
 *
 *
 * @class TrelloBoardAdapter
 * @constructor
 * @extends DS.RESTAdapter
 */
export default RESTAdapter.extend({
  trelloAuth: inject.service('TrelloAuth'),
  host: 'https://api.trello.com',
  headers: {
    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  /****************************************************************************
   * _ajax - wrap ajax call
   *
   * @param {String} url
   * @param {String} data (form encoded)
   * @param {String} type ("PUT", "POST", "DELETE")
   * @return {Promise} promise
   */
  _ajax: function(url, data, type) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: type,
        url: url,
        data: data
      }).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },
  /****************************************************************************
   * _processAttributes - transform attribute object to form encoded string
   *
   * @param {Object} params
   * @param {Object} attributes
   * @return {String} data
   */
  _processAttributes: function(params) {
    let count = 0;
    let data  = null;

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
          let value     = Ember.get(params, key);
          let element   = `${key}=${value}`;

          if(count) {
            data = data + '&' + element;
          } else {
            data = element;
          }

          count++;
        }
    }

    return data;
  }
});
