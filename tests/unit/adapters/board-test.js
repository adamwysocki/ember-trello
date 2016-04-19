import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

var trelloAuthMock = Ember.Service.extend({
  key: 1,
  token: 2
});

moduleFor('adapter:board', 'Unit | Adapter | board', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  beforeEach: function() {
    // ember 1.13
    this.container.register('service:mockTrelloAuth', trelloAuthMock);
    this.container.injection('adapter', 'trelloAuth', 'service:mockTrelloAuth');

    // ember 2.1
    // this.container.registry.register('service:mockTrelloAuth', trelloAuthMock);
    // this.container.registry.injection('adapter', 'trelloAuth', 'service:mockTrelloAuth');
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('adapters/board - it has a buildURL method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.buildURL === 'function');
});

test('adapters/board - it has a deleteRecord method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.deleteRecord === 'function');
});

test('adapters/board - it has a updateRecord method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.updateRecord === 'function');
});

test('adapters/board - it has a createRecord method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.createRecord === 'function');
});

test('adapters/board - it points to the correct namespace', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.get('namespace'), '1/boards');
});

test('adapters/board - buildURL asserts if request type if unknown', function(assert) {
  var adapter = this.subject();
  assert.throws(() => {
      adapter.buildURL('board', 1, null, 'not supported', null);
    }, Error, 'Unknown request type for board model.');
});

test('adapters/board - it builds the correct url for findRecord/updateRecord/deleteRecord', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('board', 1, null, 'findRecord', null), 'https://api.trello.com/1/boards/1?key=1&token=2');
  assert.equal(adapter.buildURL('board', 2, null, 'updateRecord', null), 'https://api.trello.com/1/boards/2?key=1&token=2');
  assert.equal(adapter.buildURL('board', 3, null, 'deleteRecord', null), 'https://api.trello.com/1/boards/3?key=1&token=2');
});

test('adapters/board - it builds the correct url for createRecord', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('board', null, null, 'createRecord', null), 'https://api.trello.com/1/boards?key=1&token=2');
});

test('adapters/board - it builds the correct url for findAll', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('board', null, null, 'findAll', null), 'https://api.trello.com/1/members/me/boards?key=1&token=2&filter=open');
});

test('adapters/board - it builds the correct url for queryRecord', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('board', null, null, 'queryRecord', { id: 1 }), 'https://api.trello.com/1/boards/1?key=1&token=2');
});

test('adapters/board - it builds the correct url for query', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('board', null, null, 'query', null), 'https://api.trello.com/1/members/me/boards?key=1&token=2');
});
