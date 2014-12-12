broccoli-tree-traverser
====================

A [Broccoli](https://github.com/broccolijs/broccoli) plugin for managing src tree navigation.

The traverser takes a path and a [Visitor](#visitor).

It traverses the input path, calling `Visitor#visit` for each file it finds.

## Visitor <a id="visitor"></a>

A visitor is any object with a `visit` method. the `visit` method takes a file path (string)
located somewhere along the input path. It should return a promise if it does anything asynchronously.

## Future enhancements

### Traversal
The traversal algorithm is an in-order traversal. That is, it traverses files and directories in the order returned by 
`fs.readdir`. Feel free to submit pull requests with other traversal algorithms.

### Visit Directories
The traverser only calls `visit` for plain files. Feel free to submit pull requests if you want to visit directories.

## Example use

### In a Brocfile:
```javascript
//Brocfile.js
var traverser = require('broccoli-tree-traverser');

var visitor = {
  visit:function(path){
    console.log('visiting', path);  
  }
};

module.exports = traverser('interesting/path', visitor);

```

### Within another plugin
```javascript
//index.js
var traverser = require('broccoli-tree-traverser');


function MyPlugin(inputTree){
  this.traverser = traverser(inputTree, this);
}

MyPlugin.prototype.visit = function(path){
  //do something interesting with the path
};

MyPlugin.prototype.read = function(readTree){
  return readTree(this.traverser);
};


module.exports = MyPlugin; 
```