Package.describe({
  name: 'leesangwon:connections',
  version: '0.0.1',
  summary: 'monitor all the connection status of the Meteor server',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'underscore'
  ]);
  api.use([
    'session',
    'tracker',
    'random',
    'mongo-livedata'
  ], 'client');

  api.use([
    'mongo',
    'leesangwon:logger',
  ], 'server');

  api.addFiles('lib/connections.js');
  api.addFiles('lib/client.js', 'client');
  api.addFiles('lib/server.js', 'server');

  api.export('Connection');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:connections');
  api.addFiles('test/connections-tests.js');
});
