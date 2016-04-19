import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

var trelloAuthMock = Ember.Service.extend({
  key: 1,
  token: 2
});

moduleFor('adapter:label', 'Unit | Adapter | label', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  beforeEach: function() {
    // ember 1.13
    this.container.register('service:mockTrelloAuth', trelloAuthMock);
    this.container.injection('adapter', 'trelloAuth', 'service:mockTrelloAuth');

    // ember 2.1
    //this.container.registry.register('service:mockTrelloAuth', trelloAuthMock);
    //this.container.registry.injection('adapter', 'trelloAuth', 'service:mockTrelloAuth');
  }

});

// Replace this with your real tests.
test('adapters/label - it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('adapters/label - it has a buildURL method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.buildURL === 'function');
});

test('adapters/label - it has a deleteRecord method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.deleteRecord === 'function');
});

test('adapters/label - it has a updateRecord method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.updateRecord === 'function');
});

test('adapters/label - it has a createRecord method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.createRecord === 'function');
});

test('adapters/label - it points to the correct namespace', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.get('namespace'), '1/labels');
});

test('adapters/label - buildURL asserts if request type if unknown', function(assert) {
  var adapter = this.subject();
  assert.throws(() => {
      adapter.buildURL('label', 1, null, 'unknown', null);
    }, Error, '[Ember Trello] Unknown request type for buildURL.');
});

test('adapters/label - buildURL assets if request type is findALL', function(assert) {
  var adapter = this.subject();
  assert.throws(() => {
      adapter.buildURL('label', 1, null, 'findAll', null);
    }, Error, '[Ember Trello] findAll is not supported for the label Model.');
});

test('adapters/label - buildURL assets if request type is query', function(assert) {
  var adapter = this.subject();
  assert.throws(() => {
      adapter.buildURL('label', 1, null, 'query', null);
    }, Error, '[Ember Trello] query is not supported for the label Model.');
});

test('adapters/label - it builds the correct url for findRecord/updateRecord/deleteRecord', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('label', 1, null, 'findRecord', null), 'https://api.trello.com/1/labels/1?key=1&token=2');
  assert.equal(adapter.buildURL('label', 2, null, 'updateRecord', null), 'https://api.trello.com/1/labels/2?key=1&token=2');
  assert.equal(adapter.buildURL('label', 3, null, 'deleteRecord', null), 'https://api.trello.com/1/labels/3?key=1&token=2');
});

test('adapters/label - it builds the correct url for createRecord', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('label', null, null, 'createRecord', null), 'https://api.trello.com/1/labels?key=1&token=2');
});

test('adapters/label - it builds the correct url for queryRecord', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.buildURL('label', null, null, 'queryRecord', { id: 1 }), 'https://api.trello.com/1/labels/1?key=1&token=2');
});
