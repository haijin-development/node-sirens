const pathLib = require('path')
const fs = require('fs')
const Classification = require('../Classification')

let FolderPath
let FilePath

/*
    Class(`
        A Path models a file or a folder in the file system.

        It is an immutable object.

        The methods that changes the path, like append(), return a new Path object.
    `)
*/
class Path {
    static definition() {
        this.instanceVariables = ['path']
    }

    initialize({ path: stringOrPath }) {
        let pathString = typeof(stringOrPath) === 'string' ?
            stringOrPath
            :
            stringOrPath.getPath()

        if( fs.existsSync( pathString ) && pathLib.isAbsolute(pathString) ) {
            pathString = pathLib.resolve( pathString )
        }

        this.path = pathString.trim()
    }

    /*
        Method(`
            Returns the resolved path of the folder.
        `)
    */
    getPath() {
        return this.path
    }

    isFolderPath() {
        return false
    }

    isFilePath() {
        return false
    }

    isEmpty() {
        return this.path === ''
    }

    /*
        Method(`
            Returns true if this FilePath is relative, false if not.
        `)
    */
    isRelative() {
        return ! this.isAbsolute()
    }

    /*
        Method(`
            Returns true if this FilePath is absolute, false if not.
        `)
    */
    isAbsolute() {
        return pathLib.isAbsolute( this.getPath() )
    }


    /*
        Method(`
            Appends the given stringOrPath to a relative folder.
        `)
    */
    append({ path: stringOrPath }) {
        if( ! FolderPath  ) { FolderPath = require('./FolderPath') }

        if( typeof(stringOrPath) !== 'string' ) {
            stringOrPath = stringOrPath.getPath()
        }

        const newPath = pathLib.join( this.path, stringOrPath )

        return FolderPath.new({ path: newPath })
    }

    /*
        Method(`
            Returns the resolved path of the folder.
        `)
    */
    appendFile({ path: stringOrPath }) {
        if( ! FilePath  ) { FilePath = require('./FilePath') }

        const pathString = typeof(stringOrPath) === 'string' ?
            stringOrPath
            :
            stringOrPath.getPath()

        const newPathString = pathLib.join( this.path, pathString )

        return FilePath.new({ path: newPathString })
    }

    /*
        Method(`
            Returns the base name of the path.
            The base name if the last component of the path. If the path points to a file
            it is the filename, if it points to a directory it is the last directory in
            the path.
        `)
    */
    getBaseName() {
        return pathLib.basename( this.getPath() )
    }

    /*
        Method(`
            Calculates and returns the relative path from this Path to the given
            anotherPath.
        `)
    */
    getPathTo(anotherPath) {
        const anotherPathString = typeof( anotherPath ) === 'string' ?
            anotherPath
            :
            anotherPath.getPath()

        const pathWalk = pathLib.relative( this.getPath(), anotherPathString )

        return FolderPath.new({ path: pathWalk })
    }
}

module.exports = Classification.define(Path)