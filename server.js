var express = require('express');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(deleteId) {
    var deleteItemIndex = -1;
    
    for (var i = 0; i < this.items.length; i += 1) {
        if (this.items[i].id === deleteId) {
            deleteItemIndex = i;
            break;
        }
    }
    
    if (deleteItemIndex === -1) {
        return null;
    }
    
    var itemDeleted = this.items[deleteItemIndex];
    this.items.splice(deleteItemIndex, 1);
    
    return itemDeleted;
};

Storage.prototype.update = function(updateItemName, updateId) {
    var updateItemIndex = -1;
    
    for (var i = 0; i < this.items.length; i += 1) {
        if (this.items[i].id === updateId) {
            updateItemIndex = i;
            break;
        }
    }
    
    if (updateItemIndex === -1) {
        return null;
    }
    
    this.items[updateItemIndex].name = updateItemName;
    return this.items[updateItemIndex];
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
   if (!req.body || !req.body.name) {
       return res.sendStatus(400);
   }
   
   var item = storage.add(req.body.name);
   res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    var deleteId = Number(req.params.id);
    
    var deletedItem = storage.delete(deleteId);
    
    if (!deletedItem) {
        return res.sendStatus(400);
    }
    
    res.status(200).json(deletedItem);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body || !req.body.name) {
        return res.sendStatus(400);
    }
    
    var updateId = Number(req.params.id);
    var updateItemName = req.body.name;
    
    var updatedItem = storage.update(updateItemName, updateId);
    
    if (!updatedItem) {
        return res.sendStatus(400);
    }
    
    res.status(200).json(updatedItem);
});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;