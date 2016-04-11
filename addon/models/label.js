import DS from 'ember-data';
import Ember from 'ember';

const { attr, Model } = DS;

export default Model.extend({
  color: attr('string'),
  idBoard: attr('string'),
  name: attr('string'),
  uses: attr('number'),

  htmlColor: Ember.computed('color', function() {
    const color = this.get('color');
    switch (color) {
      case 'sky':
        return '#00c2e0';
      case null:
        return '#b6bbbf';
      default:
        return color;
    }
  })

});
