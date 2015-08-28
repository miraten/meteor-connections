/**
 *
 */
var _connectionProc = function(connection) {
  var client = {
    _id: connection.id,
    clientId: null,
    ip: connection.clientAddress,
    userAgent: connection.httpHeaders['user-agent'],
    path: "",
    createdAt: new Date()
  };

  client._id = Connection.collection.insert(client);

  console.log('connection inserted: id = ' + client._id );

  connection.onClose(function() {
    Connection.collection.remove(connection.id, function(error) {
      if (error) {
        Logger.error('connection error: ' + error.reason);
      } else {
        console.log('connection removed');
      }
    });
  });

  return client;
};

var _userModifier = function(user) {
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    profile: user.profile,
    oauths: user.oauths
  };
};

Meteor.onConnection(_connectionProc);

Meteor.methods({
  connectionInit: function(clientId) {
    check(clientId, String);

    var saved = Connection.collection.findOne(this.connection.id);
    if (! saved) {
      _connectionProc(this.connection);
    }


    var data = { clientId: clientId };
    if (this.userId) {
      var user = Meteor.users.findOne(
        { _id: this.userId }, { fields: { services: 0 }}
      );

      console.log('connected user: ' + JSON.stringify(user));

      data = _.extend(data, { user: _userModifier(user) });
    }

    Connection.collection.update(this.connection.id, { $set: data });

    return clientId;
  },

  connectionUpdateUser: function() {
    var modifier = (this.userId) ?
      { $set: { user: _userModifier(Meteor.user()) }} :
      { $unset: { user: 1 }};

    Connection.collection.update(this.connection.id, modifier);
  },

  connectionUpdatePath: function(path) {
    check(path, String);

    Connection.collection.update(this.connection.id, { $set: { path: path }});
  }
});
