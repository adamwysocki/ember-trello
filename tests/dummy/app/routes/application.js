import Ember from 'ember';

const { Route, inject } = Ember;

export default Route.extend({
  actions: {
    login: function() {
      this.trelloAuth.authorize();
    }
  }
});
