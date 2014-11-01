broccoli-tree-traverser
====================

Manages src tree navigation, letting you deal with each file.

The traverser takes a path and a [Visitor](#visitor).

It traverses the input path, calling `visitor#visit` for each file it finds.

## Visitor <a name="visitor"></a>

A visitor can be any object with a `visit` method. the `visit` method takes a file path (string)
located somewhere along the input path. It should return a promise if it does anything asynchronously.

## Future enhancements

### Traversal
The traversal order will be fairly random at run time.
I might enhance it with options to ensure either algorithm if there is interest.

### Visit Directories
The traverser only calls `visit` for plain files. I may enhance it to visit directory paths as well, if there is 
interest.
