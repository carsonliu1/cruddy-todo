const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const promiseFuncs = Promise.promisifyAll(fs);
// const fsPromises = require('fs').promises;

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// TO-DO: Refactor so that new Todos get saved to hard drive
//  - each new Todo entry must be saved in its own file
//  - use the getNextUniqueId to create a file path in dataDir
//  - each POST request should save a Todo item in that folder
//  - DON'T store an object in the file, ONLY store the Todo text w/o the id

exports.create = (text, callback) => {

  // counter.getNextUniqueId((err, id) => {
  //   fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, err => {
  //     if (err) {
  //       throw ('couldnt create');
  //     } else {
  //       callback(null, { id, text });
  //     }
  //   });
  // });
  return counter.getNextUniqueId()
    .then(id => {
      fs.writeFileSync(path.join(exports.dataDir, `${id}.txt`), text, 'utf8');
      return id;
    })
    .then(id => {
      callback(null, {id: id, text: text});
    })
    .catch(err => console.log(err));
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};


// TO-DO: return an array of Todos to the client app whenever there's a GET request
//  - read the dataDir directory and build a list of files
//  - DON'T attempt to read the contents of each file that contains the Todo item text (yet)
//  - provide a text field in response to client (use the message id)

exports.readAll = (callback) => {
  var fileNamesArray = [];
  // fs.readdir(exports.dataDir, (err, files) => {
  //   for (var i = 0; i < files.length; i++) {
  //     var fileId = files[i].split('.')[0];
  //     fileNamesArray.push({id: fileId, text: fileId});
  //   }
  //   callback(null, fileNamesArray);
  // });
  return promiseFuncs.readdirAsync(exports.dataDir)
    .then(files => {
      let arr = files.map(file => {
        var obj = {
          id: file.split('.')[0],
          text: file.split('.')[0]
        };
        fileNamesArray.push(obj);
        return obj;
      });
    })
    .then(array => callback(null, fileNamesArray));


  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  // fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
  //   if (err) {
  //     callback(new Error(`No item with id: ${id}`));
  //   } else {
  //     callback(null, {id, text: data});
  //   }
  // });
  var directory = path.join(exports.dataDir, `${id}.txt`);

  return promiseFuncs.readFileAsync(directory, 'utf8')
    .then(data => {
      callback(null, {id, text: data});
    })
    .catch(err => {
      callback(new Error('asdfasdf'));
    });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {

  // fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
  //   if (err) {
  //     callback(new Error(`No item with id: ${id}.txt`));
  //   } else {
  //     fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
  //       if (err) {
  //         callback(new Error(`No item with id: ${id}.txt`));
  //       } else {
  //         callback(null, {id, text});
  //       }
  //     });
  //   }
  // });

  var filePath = path.join(exports.dataDir, `${id}.txt`);

  return fs.promises.readFile(filePath, 'utf8')
    .then(garbage => fs.promises.writeFile(filePath, text))
    .then(garbage => callback(null, {id, text}))
    .catch(err => callback(new Error('No item with that id')));


  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {

  // fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
  //   if (err) {
  //     callback(new Error(`No item with id`));
  //   } else {
  //     callback();
  //   }
  // });

  return fs.promises.unlink(path.join(exports.dataDir, `${id}.txt`))
    .then(data => callback())
    .catch(err => callback(new Error('error')));
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); //  /datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
