broccoli-tree-traverser
====================

A broccoli plugin helper that manages src tree navigation, letting you deal with each file.

The traverser takes a path, or another tree, and a [Visitor](#visitor).

It traverses the input path, calling `visitor#visit` for each file it finds.

## Visitor <a name="visitor"></a>

A visitor can be any object with a `visit` method. the `visit` method takes a file path (string)
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
  //do something interesting with the file
};

MyPlugin.prototype.read = function(readTree){
  return readTree(this.traverser);
};


module.exports = MyPlugin; 
```