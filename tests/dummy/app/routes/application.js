import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    login: function() {
      this.trelloAuth.authorize();
    }
  }
});
