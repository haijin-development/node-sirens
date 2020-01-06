const expect = require('chai').expect
const FolderPath = require('../../../../../src/O').FolderPath

const folderPath = __dirname + '/../../../../samples'

describe('When using a FolderPath object', () => {
    describe('when creating a FolderPath', () => {
        it('is initialized from an abolute path string', () => {
            const folder = FolderPath.new({ path: folderPath })

            expect( folder.getPath() ) .to .match(
                /^.*tests[/]samples$/
            )
        })

        it('is initialized from an abolute FolderPath', () => {
            const absoluteFolderPath = FolderPath.new({ path: folderPath })

            const folder = FolderPath.new({ path: absoluteFolderPath })

            expect( folder.getPath() ) .to .match(
                /^.*tests[/]samples$/
            )
        })

        it('is initialized from a relative path string', () => {
            const folder = FolderPath.new({ path: 'samples/js-objects' })

            expect( folder.getPath() ) .to .eql('samples/js-objects')
        })

        it('is initialized from a relative FolderPath', () => {
            const relativeFolderPath = FolderPath.new({ path: 'samples/js-objects' })

            const folder = FolderPath.new({ path: relativeFolderPath })

            expect( folder.getPath() ) .to .eql('samples/js-objects')
        })

    })

    it('returns a new FolderPath with the previous path with .dotdot()', () => {
        const folder = FolderPath.new({ path: folderPath })

        const newFolder = folder.dotdot()

        expect( newFolder.getPath() ) .to .match(
            /^.*tests$/
        )
    })

    describe('when appending a sub folder string', () => {
        it('returns a new FolderPath with the given path appended', () => {
            const folder = FolderPath.new({ path: folderPath })

            const newFolder = folder.append({ path: 'js-objects' })

            expect( newFolder.getPath() ) .to .match(
                /^.*tests[/]samples[/]js-objects$/
            )
        })

        it('preserves the original FolderPath immutable', () => {
            const folder = FolderPath.new({ path: folderPath })

            const newFolder = folder.append({ path: 'js-objects' })

            expect( folder.getPath() ) .to .match(
                /^.*tests[/]samples$/
            )
        })
    })

    describe('when appending a sub Folder object', () => {
        it('returns a new FolderPath with the given path appended', () => {
            const folder = FolderPath.new({ path: folderPath })

            const subFolder = FolderPath.new({ path: 'js-objects' })

            const newFolder = folder.append({ path: subFolder })

            expect( newFolder.getPath() ) .to .match(
                /^.*tests[/]samples[/]js-objects$/
            )
        })

        it('preserves the original FolderPath immutable', () => {
            const folder = FolderPath.new({ path: folderPath })

            const subFolder = FolderPath.new({ path: 'js-objects' })

            const newFolder = folder.append({ path: subFolder })

            expect( folder.getPath() ) .to .match(
                /^.*tests[/]samples$/
            )
        })
    })

    describe('when appending a file string', () => {
        it('returns a new FolderPath with the given path appended', () => {
            const folder = FolderPath.new({ path: folderPath })

            const newFile = folder.append({ path: 'index.js' })

            expect( newFile.getPath() ) .to .match(
                /^.*tests[/]samples[/]index.js$/
            )
        })

        it('preserves the original FolderPath immutable', () => {
            const folder = FolderPath.new({ path: folderPath })

            const newFile = folder.append({ path: 'index.js' })

            expect( folder.getPath() ) .to .match(
                /^.*tests[/]samples$/
            )
        })
    })

    describe('when reading the FolderPath direct contents', () => {
        it('gets the files in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filePathsInFolder = []

            const newFile = folder.filesDo( (filePath) => {
                filePathsInFolder.push( filePath )
            })

            expect( filePathsInFolder ) .count .to .eql(4)
            expect( filePathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]JsSintax.js$/
                )
            })
        })

        it('gets the folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const folderPathsInFolder = []

            const newFile = folder.foldersDo( (folderPath) => {
                folderPathsInFolder.push( folderPath )
            })

            expect( folderPathsInFolder ) .count .to .eql(1)
            expect( folderPathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]js-objects$/
                )
            })
        })

        it('gets the files and folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filesAndFolderPathsInFolder = []

            const newFile = folder.filesAndFoldersDo( (pathObject) => {
                filesAndFolderPathsInFolder.push( pathObject )
            })

            expect( filesAndFolderPathsInFolder ) .count .to .eql(5)

            expect( filesAndFolderPathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]JsSintax.js$/
                )
            })

            expect( filesAndFolderPathsInFolder ) .atIndex(4) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]js-objects$/
                )
            })
        })
    })

    describe('when reading the FolderPath recursive contents', () => {
        it('gets the files in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filePathsInFolder = []

            const newFile = folder.allFilesDo( (filePath) => {
                filePathsInFolder.push( filePath )
            })

            expect( filePathsInFolder ) .count .to .eql(10)
            expect( filePathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]JsSintax.js$/
                )
            })
        })

        it('gets the folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const folderPathsInFolder = []

            const newFile = folder.allFoldersDo( (folderPath) => {
                folderPathsInFolder.push( folderPath )
            })

            expect( folderPathsInFolder ) .count .to .eql(1)
            expect( folderPathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]js-objects$/
                )
            })
        })

        it('gets the files and folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filesAndFolderPathsInFolder = []

            const newFile = folder.allFilesAndFoldersDo( (pathObject) => {
                filesAndFolderPathsInFolder.push( pathObject )
            })

            expect( filesAndFolderPathsInFolder ) .count .to .eql(11)
        })
    })

    describe('when reading the FolderPath recursive contents in BFS order', () => {
        it('gets the files in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filePathsInFolder = []

            const newFile = folder.allFilesBfsDo( (filePath) => {
                filePathsInFolder.push( filePath )
            })

            expect( filePathsInFolder ) .count .to .eql(10)
            expect( filePathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]JsSintax.js$/
                )
            })
        })

        it('gets the folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const folderPathsInFolder = []

            const newFile = folder.allFoldersBfsDo( (folderPath) => {
                folderPathsInFolder.push( folderPath )
            })

            expect( folderPathsInFolder ) .count .to .eql(1)
            expect( folderPathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]js-objects$/
                )
            })
        })

        it('gets the files and folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filesAndFolderPathsInFolder = []

            const newFile = folder.allFilesAndFoldersBfsDo( (pathObject) => {
                filesAndFolderPathsInFolder.push( pathObject )
            })

            expect( filesAndFolderPathsInFolder ) .count .to .eql(11)
        })
    })

    describe('when reading the FolderPath recursive contents in DFS order', () => {
        it('gets the files in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filePathsInFolder = []

            const newFile = folder.allFilesDfsDo( (filePath) => {
                filePathsInFolder.push( filePath )
            })

            expect( filePathsInFolder ) .count .to .eql(10)
            expect( filePathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]JsSintax.js$/
                )
            })

            expect( filePathsInFolder ) .atIndex(9) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]js-objects[/]text-only.js$/
                )
            })
        })

        it('gets the folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const folderPathsInFolder = []

            const newFile = folder.allFoldersDfsDo( (folderPath) => {
                folderPathsInFolder.push( folderPath )
            })

            expect( folderPathsInFolder ) .count .to .eql(1)
            expect( folderPathsInFolder ) .atIndex(0) .to .be .suchThat( (filePath) => {
                expect( filePath.getPath() ) .to .match(
                    /^.*tests[/]samples[/]js-objects$/
                )
            })
        })

        it('gets the files and folders in the FolderPath', () => {
            const folder = FolderPath.new({ path: folderPath })

            const filesAndFolderPathsInFolder = []

            const newFile = folder.allFilesAndFoldersDfsDo( (pathObject) => {
                filesAndFolderPathsInFolder.push( pathObject )
            })

            expect( filesAndFolderPathsInFolder ) .count .to .eql(11)
        })
    })

})