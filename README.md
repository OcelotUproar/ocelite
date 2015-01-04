# Ocelite

Schemaless, embeddable, Node.js database

## Install
```
$ npm install ocelite
```

## API
### Db.init
Creates a connection to the database. Provide the filename of where to store the database file along with an array of items you're planning to store. 

```
var Ocelite = require('ocelite');

var db = new Ocelite();
db.init('data.db', ['user'], callback);
```
### Db.save
Saves an object to the database. First parameter is the item name matching one of the names provided in init. Second parameter is the data you're saving. The third is an optional parameter of data to index. 
```
db.save('user', {name: 'Barbara Fusinska', twitter: 'basiafusinska'}, ['twitter'], callback);
```
### Db.get
Access saved data by there index. First parameter is the type, followed by index name and the value. This returns an array of items.
```
db.get('user', 'twitter', 'basiafusinska', function(err, rows) { 
  console.log(rows);
});
```
### Db.all
Return all the data saved for a particular type as an array.
```
db.all('user', function(err, rows) { 
  console.log(rows);
});
```

## Example
```
var Ocelite = require('ocelite');

var db = new Ocelite();
db.init('data.db', ['user'], function() {
  db.save('user', {name: 'Barbara Fusinska', twitter: 'basiafusinska'}, ['twitter'], function() {
      db.get('user', 'twitter', 'basiafusinska', function(err, obj) {
        console.log(obj);
      });
 });
});

```

