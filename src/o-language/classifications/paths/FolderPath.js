const fs = require('fs')
const pathLib = require('path')
const Classification = require('../Classification')
const Path = require('./Path')
const FilePath = require('./FilePath')

/*
    Class(`
        A FolderPath models a folder in the file system.

        It is an immutable object.

        The methods that changes the path, like append(), return a new FolderPath object.
    `)
*/
class FolderPath {
    static definition() {
        this.instanceVariables = []
        this.assumes = [Path]
    }

    isFolderPath() {
        return true
    }

    /*
        Method(`
            Returns true if the folder pointed by this FilePath exists, false if not.
        `)
    */
    exists() {
        return fs.existsSync( this.getPath() )
    }

    /*
        Method(`
            Returns the .. path from this Path.
        `)
    */
    dotdot() {
        return this.append({ path: '..' })
    }

    // Iterating


    /*
        Method(`
            Iterates the files in this FolderPath.
            It does not include the files in the subfolders of this FolderPath.
            To include the subfolders as well use allFilesDo instead.
        `)
    */
    filesDo(closure) {
        this.filesAndFoldersDo( (eachPath) => {
            if( ! eachPath.isFilePath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the folders in this FolderPath.
            It does not include the subfolders beyond this FolderPath direct sub folders.
            To include the subfolders as well use allFoldersDo instead.
        `)
    */
    foldersDo(closure) {
        this.filesAndFoldersDo( (eachPath) => {
            if( ! eachPath.isFolderPath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the files and folders in this FolderPath.
            It does not include the subfolders beyond this FolderPath direct sub folders.
            To include the subfolders as well use allFilesAndFoldersDo instead.
        `)
    */
    filesAndFoldersDo(closure) {
        const thisFolderPath = this.getPath()

        const folderContents = fs.readdirSync( thisFolderPath, { withFileTypes: true } )

        folderContents.forEach( (eachFileStat) => {
            const fullPath = pathLib.join( thisFolderPath, eachFileStat.name )

            const path = eachFileStat.isDirectory() ?
                this.thisClassification().new({ path: fullPath })
                :
                FilePath.new({ path: fullPath })

            closure( path )
        })        
    }

    /*
        Method(`
            Iterates the files in this FolderPath and in its subfolders recursevely.
        `)
    */
    allFilesDo(closure) {
        this.allFilesAndFoldersDo( (eachPath) => {
            if( ! eachPath.isFilePath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the folders in this FolderPath and in its subfolders recursevely.
        `)
    */
    allFoldersDo(closure) {
        this.allFilesAndFoldersDo( (eachPath) => {
            if( ! eachPath.isFolderPath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the files and folders in this FolderPath and in its subfolders recursevely.

            The files and folders are iterated in BFS order.
            Would you like to use a DFS order use

                .allFilesAndFoldersDfsDo(...)

            instead.
        `)
    */
    allFilesAndFoldersDo(closure) {
        this.allFilesAndFoldersBfsDo( closure )
    }

    /*
        Method(`
            Iterates the files in this FolderPath and in its subfolders
            recursevely in a BFS order.
        `)
    */
    allFilesBfsDo(closure) {
        this.allFilesAndFoldersBfsDo( (eachPath) => {
            if( ! eachPath.isFilePath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the folders in this FolderPath and in its subfolders
            recursevely in a BFS order.
        `)
    */
    allFoldersBfsDo(closure) {
        this.allFilesAndFoldersBfsDo( (eachPath) => {
            if( ! eachPath.isFolderPath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the files and folders in this FolderPath and in its subfolders
            recursevely in a BFS order.
        `)
    */
    allFilesAndFoldersBfsDo(closure) {
        const queue = []

        queue.unshift( this )

        while( queue.length > 0 ) {
            const current = queue.pop()

            // First queue the next folder for the iteration, then evaluate the
            // closure on the current file or folder.
            // This ensures that if the iteration performs some operation with
            // secondary effects on the folder (like deleting it) its children
            // were already queuded
            if( current.isFolderPath() ) {
                const currentPath = current.getPath()

                const folderContents = fs.readdirSync( currentPath, { withFileTypes: true } )

                for( const eachFileStat of folderContents ) {
                    const fullPath = pathLib.join( currentPath, eachFileStat.name )

                    const eachPath = eachFileStat.isDirectory() ?
                        this.thisClassification().new({ path: fullPath })
                        :
                        FilePath.new({ path: fullPath })

                    queue.unshift( eachPath )
                }
            }

            // skip this FolderPath
            if( current !== this ) {
                closure( current )
            }
        }
    }

    /*
        Method(`
            Iterates the files in this FolderPath and in its subfolders
            recursevely in a DFS order.
        `)
    */
    allFilesDfsDo(closure) {
        this.allFilesAndFoldersDfsDo( (eachPath) => {
            if( ! eachPath.isFilePath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the folders in this FolderPath and in its subfolders
            recursevely in a DFS order.
        `)
    */
    allFoldersDfsDo(closure) {
        this.allFilesAndFoldersDfsDo( (eachPath) => {
            if( ! eachPath.isFolderPath() ) { return }

            closure( eachPath )
        })
    }

    /*
        Method(`
            Iterates the files and folders in this FolderPath and in its subfolders
            recursevely in a DFS order.
        `)
    */
    allFilesAndFoldersDfsDo(closure) {
        const queue = []

        queue.push( this )

        while( queue.length > 0 ) {
            const current = queue.pop()

            // First queue the next folder for the iteration, then evaluate the
            // closure on the current file or folder.
            // This ensures that if the iteration performs some operation with
            // secondary effects on the folder (like deleting it) its children
            // were already queuded
            if( current.isFolderPath() ) {
                const currentPath = current.getPath()

                const folderContents = fs.readdirSync( currentPath, { withFileTypes: true } )

                const nextFolderItems = []

                for( const eachFileStat of folderContents ) {
                    // Preserve the order among files and subfolders in a folder
                    nextFolderItems.unshift( eachFileStat )
                }

                for( const eachFileStat of nextFolderItems ) {
                    const fullPath = pathLib.join( currentPath, eachFileStat.name )

                    const eachPath = eachFileStat.isDirectory() ?
                        this.thisClassification().new({ path: fullPath })
                        :
                        FilePath.new({ path: fullPath })

                    queue.push( eachPath )
                }
            }

            // skip this FolderPath
            if( current !== this ) {
                closure( current )
            }
        }
    }

    /*
        Method('
            Creates the folder pointed by this FolderPath.

            If the folder already exists and a ifExistsClosure is given it evaluates
            the ifExistsClosure closure.
            If the folder already exists and no ifExistsClosure is given it raises
            en error.
        ')
    */
    createFolder({ ifExists: ifExistsClosure } = {}) {
        if( this.exists() && ifExistsClosure !== undefined) {
            return ifExistsClosure({ path: this })
        }

        fs.mkdirSync( this.getPath(), { recursive: true } )
    }

    /*
        Method(`
            Deletes the folder pointed by this FolderPath.

            If the folder does not exist and a notExistsClosure is given it evaluates
            the notExistsClosure closure.
            If the folder does not exist and no notExistsClosure is given it raises
            en error.
        `)
    */
    delete({ ifNotExists: notExistsClosure, deleteContents: deleteContents } = {}) {
        if( ! this.exists() && notExistsClosure !== undefined) {
            return notExistsClosure({ path: this })
        }

        if( deleteContents === true ) {
            this.allFilesAndFoldersDfsDo( (eachPath) => {
                eachPath.delete({
                    deleteContents: true,
                    ifNotExists: function() {},
                })
            })
        }

        fs.rmdirSync( this.getPath() )
    }
}

module.exports = Classification.define(FolderPath)