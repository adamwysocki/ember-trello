export function initialize(application) {
  application.inject('route', 'trelloAuth', 'service:trello-auth');
  application.inject('adapter', 'trelloAuth', 'service:trello-auth');
}

export default {
  name: 'trello-auth',
  initialize: initialize
};
