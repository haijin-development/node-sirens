const FolderPath = require('./../src/O').FolderPath
const FilePath = require('./../src/O').FilePath

/*
    Class(`
        This class copies files and folders from a source to a temporary folder.

        It can be used by tests that create, modify or delete files.

        Before running the test use this object to make a temporary copy of the
        source files, then use the copy through this FilesRepository API and
        and finally tell the FilesRepository to cleanup the temporary files and folders.

        The exported object is not the class FilesRepository but a singleton instance
        of it that acts as a global object between tests.
        This allows some setup and cleanup in the outerscope of a test that might
        not be located in the same file as the test.
    `)
*/
class FilesRepository {
    constructor({ baseSourceFolder: baseSourceFolder, tmpFolderPath: tmpFolderPath }) {
        this.baseSourceFolder = FolderPath.new({ path: baseSourceFolder })
        this.tmpFolderPath = FolderPath.new({ path: tmpFolderPath })
        this.managedFiles = new Map()
    }

    defaultTmpFolderPath() {
        return FolderPath.new({
            path: __dirname + '/tmp-files-repository'
        })
    }

    /*
        Method(`
            Makes a copy of the given sourceFilePath to the temporary directory
            and maps the path of the sourceFilePath to the temporary path so it can
            be correctly referenced.
        `)
    */
    manageFile({ file: sourceFilePath }) {
        this.ensureTmpFolderExists()

        const resolvedSourceFilePath = FilePath.new({ path: sourceFilePath })

        const pathToBaseSourceFolder = this.pathToBaseSourceFolder({
            sourcePath: resolvedSourceFilePath
        })

        const temporaryFilePath = this.tmpFolderPath
            .append({ path: pathToBaseSourceFolder })
            .appendFile({ path: resolvedSourceFilePath.getFileName() })

        resolvedSourceFilePath.copyFileTo({ path: temporaryFilePath })

        this.managedFiles.set(
            sourceFilePath,
            temporaryFilePath.getPath(),
        )
    }

    manageFolder({ folder: folderPathString }) {
        this.ensureTmpFolderExists()

        const resolvedSourceFolderPath = FolderPath.new({ path: folderPathString })

        const pathToBaseSourceFolder = this.pathToBaseSourceFolder({
            sourcePath: resolvedSourceFolderPath
        })

        const temporaryFolderPath = this.tmpFolderPath
            .append({ path: pathToBaseSourceFolder })

        temporaryFolderPath.createFolder()

        this.managedFiles.set(
            folderPathString,
            temporaryFolderPath.getPath(),
        )

        resolvedSourceFolderPath.allFilesAndFoldersBfsDo( (eachSourcePath) => {
            if( eachSourcePath.isFilePath() ) {
                this.manageFile({ file: eachSourcePath.getPath() })
            }
        })
    }

    /*
        Method(`
            Returns the temporary file copied from the given sourceFilePath.
        `)
    */
    pathTo(sourceFilePath) {
        return this.managedFiles.get(
            sourceFilePath
        )
    }

    /*
        Method(`
            Returns the relative path from the given sourceFilePath to
            this.baseSourceFolder.
        `)
    */
    pathToBaseSourceFolder({ sourcePath: sourcePath }) {
        const sourceFileFolder = sourcePath.isFilePath() ?
            sourcePath.getFolderPath()
            :
            sourcePath

        return this.baseSourceFolder.getPathTo( sourceFileFolder )
    }

    /*
        Method(`
            If the temporary folder does not exist it creates it with no contents.
            If it already exists does nothing.
        `)
    */
    ensureTmpFolderExists() {
        if( this.tmpFolderPath.exists() ) { return }

        this.tmpFolderPath.createFolder()
    }

    /*
        Method(`
            Deletes the temporary folder and its contents and clears the managed files
            table.
        `)
    */
    cleanUp() {
        this.tmpFolderPath.delete({
            deleteContents: true,
            ifNotExists: function() {},
        })

        this.managedFiles = new Map()
    }
}

module.exports = FilesRepository