import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:base', 'Unit | Adapter | base', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

// Replace this with your real tests.
test('adapters/base - it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('adapters/base - it has a _ajax method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter._ajax === 'function');
});

test('adapters/base - it has a _processAttributes method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter._processAttributes === 'function');
});

test('adapters/base - it points to the correct host', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.get('host'), 'https://api.trello.com');
});

test('adapters/base - it has the correct content-type', function(assert) {
  var adapter = this.subject();
  assert.deepEqual(adapter.get('headers'), { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' });
});
