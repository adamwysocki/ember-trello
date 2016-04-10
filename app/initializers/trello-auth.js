export { default, initialize } from 'ember-trello/initializers/trello-auth';

export default {
  name: 'trello-auth',
  before: 'store',
  initialize
};
