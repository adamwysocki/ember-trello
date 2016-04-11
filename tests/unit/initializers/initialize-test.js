import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { module } from 'qunit';

var App;

module( 'Unit - initializer:initialize', {
  beforeEach: function() {
    App = startApp();
  },

  afterEach: function() {
    Ember.run( App, App.destroy );
  }
});
