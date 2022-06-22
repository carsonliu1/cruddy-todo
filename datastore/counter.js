const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');


var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};
const readCounterAsync = Promise.promisify(readCounter);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};
const writeCounterAsync = Promise.promisify(writeCounter);


// Public API - Fix this function //////////////////////////////////////////////
exports.getNextUniqueId = () => {

  // attempt to read the file to see if it exists
  //if it does exist, take the currentID and call writeCounter with currentID+1
  return fs.promises.readFile(exports.counterFile, 'utf8')
    .then(currentID => {
      let newCount = zeroPaddedNumber(Number(currentID) + 1);
      fs.promises.writeFile(exports.counterFile, newCount);
      return newCount;
    })
    .catch(err => console.error(err));




  // readCounter((err, count) => {
  //   if (err) {
  //     throw ('Error occurred');
  //   } else {
  //     writeCounter(count + 1, cb);
  //   }
  // });


  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
