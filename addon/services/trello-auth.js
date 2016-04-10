/* global Trello */
import Ember from 'ember';

const { Service, computed } = Ember;

export default Service.extend({
  _token: null,
  _key: null,
  token: computed('_token', function(){
    return this.get('_token');
  }),
  key: computed('_key', function() {
    return this.get('_key');
  }),
  authorize(successCallback, failureCallback) {
    let authenticationSuccess = () => {
      this.set('_token', Trello.token());
      this.set('_key', Trello.key());
      console.log("Successful authentication");
    };

    let authenticationFailure = function() {
      console.log("Failed authentication");
    };

    if(!successCallback) {
      successCallback = authenticationSuccess;
    }

    if(!failureCallback) {
      failureCallback = authenticationFailure;
    }

    Trello.authorize({
      type: "popup",
      name: "Ember Trello Test",
      scope: { read: true, write: true },
      expiration: "never",
      success: authenticationSuccess,
      error: authenticationFailure
    });
  }
});
