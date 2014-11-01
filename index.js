'use strict';

var RSVP = require('rsvp'),
  fs = require('fs'),
  path = require('path');

/**
 * Walk the input tree, calling visitor#visit for every file in the path.
 *
 * `vistor.visit` can return nothing, or a promise if it's behaving asynchronously.
 *
 * @param inputTree - input tree or path
 * @param visitor - an object
 * @return {TreeTraverser}
 * @constructor
 * @alias module:index
 */
function TreeTraverser(inputTree, visitor) {
  if (!(this instanceof TreeTraverser)) return new TreeTraverser(inputTree, visitor);

  this.inputTree = inputTree;
  this.visitor = visitor;
}

/**
 *
 * Read the directory, and stat the files it contains. Returns a promise
 * that will be resolved with the result of statFiles
 *
 * @param srcDir {string} the directory to read
 * @return {RSVP.Promise}
 */
TreeTraverser.prototype.readDir = function (srcDir) {
  var self = this;
  //make a promise to read the directory.
  return new RSVP.Promise(function (resolve, reject) {
    fs.readdir(srcDir, function (err, files) {
      //Resolve with all files or err
      if (err) { reject(err); }
      else {
        resolve(self.statFiles(srcDir, files));
      }
    });
  });
};

/**
 * Stat all the files in `parentPath`, calling `readDir` for directories,
 * and deferring to the visitor for plain files.
 * The resulting promise will be resolved with an array of promises.
 *
 * @param parentPath {string} the parent directory for the files
 * @param files {array} the list of files in the directory
 * @return {RSVP.Promise}
 */
TreeTraverser.prototype.statFiles = function statFiles(parentPath, files) {
  var self = this;

  //make a promise to stat all files, which is resolved
  return RSVP.all(files.map(function (file) {
    //when each file is statted
    return new RSVP.Promise(function (resolve, reject) {
      var filePath = path.join(parentPath, file);
      //read the file
      fs.lstat(filePath, function (err, stat) {
        if (err) { reject(err)}
        else {
          if (stat.isDirectory()) {
            //and resolve it with the promise to read the directory
            resolve(self.readDir(filePath))
          } else {
            //or a visit to the filepath
            resolve(self.visitor.visit(filePath));
          }
        }
      });
    });
  }));
};

/**
 * Implementation of Brocolli's required `read` method for a tree
 *
 * Read the input tree, then read read the src dir
 *
 * @param readTree
 * @return {RSVP.Promise}
 */
TreeTraverser.prototype.read = function (readTree) {
  var self = this;

  return readTree(self.inputTree)
    .then(this.readDir.bind(this))
    .then(function () {
      return self.inputTree;
    });
};

TreeTraverser.prototype.cleanup = function () {

};

/**
 *
 * @type {TreeTraverser}
 */
module.exports = TreeTraverser;