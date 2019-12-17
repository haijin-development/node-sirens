const fs = require('fs')
const path = require('path')

const tmpFilesFolderPath = path.resolve( __dirname + '/../../tmp-files-repository/' ) + '/'

class FilesRepository {
    constructor() {
        this.managedFiles = new Map()
    }

    pathTo( filePath ) {
        if( ! this.managedFiles.has(filePath) ) {
            throw new Error(`File ${filePath} was not initialized in this FilesRepository.`)
        }

        return this.managedFiles.get( filePath )
    }

    manageFolder({ folder: folderPath }) {
        this.ensureTmpFolderExists()

        const folderCopyPath = tmpFilesFolderPath

        this.managedFiles.set( folderPath, folderCopyPath )        

        const folderContents = fs.readdirSync( folderPath, { withFileTypes: true } )

        folderContents.forEach( (eachPath) => {
            const fullPath = path.join( folderPath, eachPath.name )

            if( eachPath.isFile() ) {
                this.manageFile({ file: fullPath })
            }
        })
    }

    manageAllFiles({ files: filePaths }) {
        filePaths.forEach( (filePath) => {
            this.manageFile({ file: filePath })
        })
    }

    manageFile({ file: filePath }) {
        this.ensureTmpFolderExists()

        const fileCopyPath = tmpFilesFolderPath + path.basename( filePath )

        fs.copyFileSync( filePath, fileCopyPath )

        this.managedFiles.set( filePath, fileCopyPath )
    }

    cleanUp() {
        this.deleteFolder({ folder: tmpFilesFolderPath })

        this.managedFiles = new Map()
    }

    ensureTmpFolderExists() {
        if( fs.existsSync( tmpFilesFolderPath ) ) { return }

        fs.mkdirSync( tmpFilesFolderPath )        
    }

    deleteFolder({ folder: folderPath }) {
        if( ! fs.existsSync( folderPath ) ) { return }

        const folderContents = fs.readdirSync( folderPath, { withFileTypes: true } )

        folderContents.forEach( (eachPath) => {
            const fullPath = path.join( folderPath, eachPath.name )

            if( eachPath.isFile() ) {
                fs.unlinkSync( fullPath )
            }

            if( eachPath.isDirectory() ) {
                this.deleteFolder({ folder: fullPath })
            }
        })

        fs.rmdirSync( folderPath )
    }
}

const filesRepository = new FilesRepository()

module.exports = filesRepository