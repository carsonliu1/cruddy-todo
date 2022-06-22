const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId((err, id) => {
    if (err) throw('an error occurred before file write')
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err)=> {
      if (err) {
        throw('an error occurred during posting')
      } else {
        callback(null, {id, text})
      }
    })
  })
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  let arr = []
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      throw('error occurred during get request')
    } else {
      // console.log(data,'outside')
      data.forEach(file => {
        let id = file.split('.')[0]
        arr.push({id, text:id})
      })
      callback(null, arr)
    }
  })
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, `/${id}.txt`), 'utf-8', (err, data) => {
    if (err) {
      callback(new Error (`No item with id: ${id}`))
    } else {
      callback(null, {id, text:data})
    }
  })
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, `/${id}.txt`), 'utf-8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, data) => {
        callback(null, {id, text:data})
      })
    }
  })
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), err => {
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      callback()
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
