var debug = require('debug')('ocelite');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

var Db = function() {
  var self = this;

  this.init = function(file, store, cb) {
    self._db = new sqlite3.Database(file);
    initSchema(store, cb);
  };

  this.save = function(store, data, indexes, cb) {
    var createIndex = arguments.length == 4;
    if (arguments.length == 3) { 
      if (Object.prototype.toString.call(indexes) == "[object Function]") {
        cb = indexes; 
      }
    }
    self._db.run('INSERT INTO ' + store + '(data) VALUES (?)', JSON.stringify(data), function(err, result) {
      var lastID = this.lastID;
      if(createIndex) {
        var indexesToCreate = [];
        for(var i in indexes) {
          var r = indexes[i];
          indexesToCreate.push({store: store, id: lastID, index: r, value: data[r] });
        }

        async.map(indexesToCreate, saveIndex, cb);
      } else {
        cb();
      }
    });
  };

  var initSchema = function(store, cb) {
    async.map(store, initTable, cb);
  };

  var initTable = function(table, cb) {
    var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + table + "';";
    var createTable = "CREATE TABLE " + table + "(id integer primary key, data blob, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    var createIndexTable = "CREATE TABLE " + table + "_index (id integer primary key, related_id integer, key blob, value blob)";

    self._db.get(query, function(err, row) {
      if(row !== undefined) {
        debug("Table Exists", table);
        return cb(null, table);
      } else  {
        debug("Creating Table", table);
        self._db.run(createTable, function() {
          self._db.run(createIndexTable, function() { cb(null, table);});
        });
      }
    });
  };

  var saveIndex = function(data, cb) {
    self._db.run('INSERT INTO ' + data.store + '_index (related_id, key, value) VALUES (?, ?, ?)', [data.id, data.index, data.value], cb);
  };


};


var db = new Db();
db.init('data.db', ['user'], function() {
  db.save('user', {name: 'Barbara Fusinska'}, ['name'], function(err) {
    console.log('Done');
  });
});



