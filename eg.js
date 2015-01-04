var async = require('async');
var Db = require('./db');

var db = new Db();

async.series([
              function(cb) { db.init('data.db', ['user'], cb); },
              //function(cb) { db.connect('data.db', cb); },
              function(cb) { db.save('user', {name: 'Barbara Fusinska', twitter: 'basiafusinska'}, ['name'], cb); },
              function(cb) { db.get('user', 'name', 'Barbara Fusinska', function(err, obj) {
                                console.log(obj);
                                cb();
                              }); 
              },
              function(cb) { db.all('user', function(err, rows) {
                                console.log(rows);
                                cb();
                              }); 
              }
            ], 
            function() {
              console.log("Finished");
            });

