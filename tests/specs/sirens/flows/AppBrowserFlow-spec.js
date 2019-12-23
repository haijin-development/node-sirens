const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const AppBrowserFlow = require('../../../../src/sirens/flows/app-browser/AppBrowserFlow')

describe('When using an AppBrowserFlow', () => {
    const sampleFolder = __dirname + '/../../../samples'

    let folder

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFolder({ folder: sampleFolder })

        folder = FilesRepository.pathTo( sampleFolder )
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has an ApplicationCommandsController', () => {

        const flow = AppBrowserFlow.new()

        expect( flow ) .commandsController .to .behaveAs('ApplicationCommandsController')
    })

    it('has all these child flows defined', () => {

        const flow = AppBrowserFlow.new()

        expect( flow ) .to .haveChildFlows([
            'main.windowTitle',
            'main.filesTree',

            'main.flow-commands.pickAndOpenFolder',
            'main.flow-commands.openPlayground',

            'main.flow-commands',
            'main.flow-commands.pickFolder',
            'main.flow-commands.openFolder',
            'main.flow-commands.getSelectedFilePath',
            'main.flow-commands.hasAClassSelected',

            'main.browsingMode',
            'main.browsingMode.showsUnformattedComments',
            'main.browsingMode.isEditingDocumentation',
            'main.browsingMode.browsingDocumentation',

            'main.selectedFile',
            'main.selectedFile.fileObjects',

            'main.selectedFile.flow-commands',
            'main.selectedFile.flow-commands.getFileObjectComponent',
            'main.selectedFile.flow-commands.getSelectedFileObject',
            'main.selectedFile.flow-commands.getFileObjectInspectorFlow',
            'main.selectedFile.flow-commands.getSourceFile',

            'main.selectedFile.selectedFileObject',
            'main.selectedFile.selectedFileObject.text',
            'main.selectedFile.selectedFileObject.flow-commands',
            'main.selectedFile.selectedFileObject.flow-commands.getText',
        ])
    })

    describe('browing mode', () => {
        const flow = AppBrowserFlow.new()

        it('showsUnformattedComments is set to false', () => {
            expect(flow) .withId( 'main.browsingMode.showsUnformattedComments' )
                .to .haveValue(false)
        })

        it('isEditingDocumentation is set to false', () => {
            expect(flow) .withId( 'main.browsingMode.isEditingDocumentation' )
                .to .haveValue(false)
        })
    })

    describe('when setting a folder', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: folder })
        })

        it('sets the folder to the main flow', () => {
            expect(flow) .withId( 'main' ) .withValue .suchThat( (value) => {
                expect( value.getPath() ) .to .match(/^.*tmp-files-repository$/)
            })
        })

        it('sets the window title', () => {
            expect(flow) .withId( 'main.windowTitle' ) .withObject .suchThat( (object) => {
                expect( object.getPath() ) .to .match(/^.*tmp-files-repository$/)
            })

            expect(flow) .withId( 'main.windowTitle' ) .withValue .suchThat( (title) => {
                expect( title ) .to .match(/^App Browser -.*tmp-files-repository$/)
            })
        })

        it('sets the filesTree root', () => {
            const path = flow.getValue()

            expect(flow) .withId( 'main.filesTree' ) .withRoots .eachSuchThat( (eachRoot) => {
                expect( eachRoot.getPath() ) .to .match(/^.*tmp-files-repository$/)
            })

        })

    })

    describe('when setting a null folder', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: folder })
            flow.openFolder({ folderPath: null })
        })

        it('sets the folder to the main flow', () => {
            expect(flow) .withId( 'main' ) .withValue .suchThat( (value) => {
                expect( value ) .to .be .null
            })
        })

        it('sets the window title', () => {
            expect(flow) .withId( 'main.windowTitle' ) .withObject .suchThat( (object) => {
                expect( object ) .to .be .null
            })

            expect(flow) .withId( 'main.windowTitle' ) .withValue .suchThat( (title) => {
                expect( title ) .to .equal('App Browser - No folder selected.')
            })
        })

        it('sets the filesTree root', () => {
            const path = flow.getValue()

            expect(flow) .withId( 'main.filesTree' ) .to .haveRoots( [] )

        })

    })

    describe('when selecting a file in the filesTree', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: folder })
        })

        it('sets the selectedFile', () => {
            const filesTree = flow.getChildFlow({ id: 'filesTree' })

            const rootFolder = filesTree.getRoots()[0]

            const file = rootFolder.getChildren()
                .find( (file) => { return file.getBaseName() === 'class-definition.js' })

            filesTree.setSelection([ rootFolder, file ])

            expect(flow) .withId( 'main.selectedFile' ) .withValue .suchThat( (sourceFile) => {
                expect( sourceFile.getFilePath() ) .to
                    .match(/^.*tmp-files-repository[/]class-definition.js$/)
            })
        })
    })

    describe('when selecting a null selection in the filesTree', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: folder })

            const filesTree = flow.getChildFlow({ id: 'filesTree' })

            const rootFolder = filesTree.getRoots()[0]

            const file = rootFolder.getChildren()
                .find( (file) => { return file.getBaseName() === 'class-definition.js' })

            filesTree.setSelection([ rootFolder, file ])
        })

        it('sets the selectedFile to null', () => {
            const filesTree = flow.getChildFlow({ id: 'filesTree' })

            filesTree.setSelection(null)

            expect(flow) .withId( 'main.selectedFile' ) .withValue .suchThat( (sourceFile) => {
                expect( sourceFile ) .to .be .null
            })
        })
    })

    describe('when switching the documentation mode to :showsUnformattedComments', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: folder })
        })

        it('sets the :showsUnformattedComments mode to the selectedFile flow', () => {
            flow.showsUnformattedComments({ value: false })
        })
    })

})