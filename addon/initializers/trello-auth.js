import { default as Board } from '../models/board';

export function initialize() {
  let application = arguments[1] || arguments[0];

  application.inject('route', 'trelloAuth', 'service:trello-auth');
  application.inject('adapter', 'trelloAuth', 'service:trello-auth');

  application.register( 'model:board', Board );
}
