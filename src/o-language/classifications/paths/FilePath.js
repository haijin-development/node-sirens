const fs = require('fs')
const pathLib = require('path')
const Classification = require('../Classification')
const Path = require('./Path')

/*
    Class(`
        A FilePath models a file path (not a file handle) in the file system.

        It is an immutable object.

        The methods that changes the path, like .dotdot(), return a new FilePath object.
    `)
*/
class FilePath {
    static definition() {
        this.instanceVariables = []
        this.assumes = [Path]
    }

    isFilePath() {
        return true
    }

    /*
        Method(`
            Returns true if the file pointed by this FilePath exists, false if not.
        `)
    */
    exists() {
        return fs.existsSync( this.getPath() )
    }


    /*
        Method(`
            Returns the name of the file, including its extesion.
            To get the filename without its extesion pass
                { withExtenstion: false }
        `)
    */
    getFileName({ withExtension: withExtension } = { withExtension: true }) {
        const path = this.getPath()
        const extension = this.getFileNameExtension()

        return withExtension === false ?
            pathLib.basename( path, extension )
            :
            pathLib.basename( path )
    }

    /*
        Method(`
            Returns the extesion of the filename, including the dot ('.ext').
        `)
    */
    getFileNameExtension() {
        return pathLib.extname( this.getPath() )
    }

    /*
        Method(`
            Returns the FolderPath of the directory containing this FilePath.
        `)
    */
    getFolderPath() {
        const FolderPath = require('./FolderPath')
        const folderString = pathLib.dirname( this.getPath() )

        return FolderPath.new({ path: folderString })
    }

    /*
        Method(`
            Returns the contents of the file pointed by this FilePath.
            
            Note that if the file is large enough this method of reading the file
            contents is inneficient and a streamed reader should be used instead.

            For the most commonly used files, like configuration files, this method is
            ok thou.
        `)
    */
    readFileContents() {
        return fs.readFileSync( this.getPath() ).toString()
    }

    /*
        Method(`
            Writes the contents to the file pointed by this FilePath overriding
            any previous contents.

            Note that if the file is large enough this method of writing the file
            contents is inneficient and a streamed writer should be used instead
            (concatenating strings to write the file contents is discouraged).

            For the most commonly used files, like configuration files, this method is
            ok enough thou.
        `)
    */
    writeFileContents(contents) {
        return fs.writeFileSync( this.getPath(), contents )
    }

    /*
        Method(`
            Copies the file pointed by this FilePath to the given targetFilePath
        `)
    */
    copyFileTo({ path: targetFilePath }) {
        const targetPath = this.thisClassification().new({ path: targetFilePath })

        const targetFolder = targetPath.getFolderPath()

        targetFolder.createFolder()

        fs.copyFileSync( this.getPath(), targetPath.getPath() )
    }

    /*
        Method(`
            Deletes the file pointed by this FilePath.

            If the file does not exist and a notExistsClosure is given it evaluates
            the notExistsClosure closure.
            If the file does not exist and no notExistsClosure is given it raises
            en error.
        `)
    */
    delete({ ifNotExists: notExistsClosure } = {}) {
        if( ! this.exists() && notExistsClosure !== undefined) {
            return notExistsClosure({ path: this })
        }

        fs.unlinkSync( this.getPath() )
    }
}

module.exports = Classification.define(FilePath)