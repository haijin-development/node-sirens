const expect = require('chai').expect
const AppBrowserFlow = require('../../../../src/sirens/flows/app-browser/AppBrowserFlow')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')

const folder = __dirname + '/../../../samples'

describe('When using an AppBrowserFlow', () => {
    it('has an ApplicationCommandsController', () => {

        const flow = AppBrowserFlow.new()

        expect( flow ) .to .haveAsCommandsControllerAn(ApplicationCommandsController)
    })

    it('has all these child flows defined', () => {

        const flow = AppBrowserFlow.new()

        expect( flow ) .to .haveChildFlows([
            'main.windowTitle',
            'main.filesTree',

            'main.pickAndOpenFolder',
            'main.openFileEditor',
            'main.openPlayground',
            'main.pickFolder',
            'main.openFolder',
            'main.getSelectedFilePath',
            'main.hasAClassSelected',

            'main.selectedFile',

            'main.selectedFile.fileObjects',
            'main.selectedFile.selectedSectionContents',

            'main.selectedFile.getSourceFile',

            'main.selectedFile.selectedSectionContents.classMethods',
            'main.selectedFile.selectedSectionContents.selectedMethod',

            'main.selectedFile.selectedSectionContents.openClassDocumentation'

        ])
    })

    describe('when setting a folder', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: folder })            
        })

        it('sets the folder to the main flow', () => {
            expect(flow) .withId( 'main' ) .toHaveAValueSuchThat( (value) => {
                expect( value.getPath() ) .to .match(/^.*tests[/]samples$/)
            })
        })

        it('sets the window title', () => {
            expect(flow) .withId( 'main.windowTitle' ) .toHaveAnObjectSuchThat( (object) => {
                expect( object.getPath() ) .to .match(/^.*tests[/]samples$/)
            })

            expect(flow) .withId( 'main.windowTitle' ) .toHaveAValueSuchThat( (title) => {
                expect( title ) .to .match(/^App Browser -.*tests[/]samples$/)
            })
        })

        it('sets the filesTree root', () => {
            const path = flow.getValue()

            expect(flow) .withId( 'main.filesTree' ) .toHaveRootsSuchThat( (eachRoot) => {
                expect( eachRoot.getPath() ) .to .match(/^.*tests[/]samples$/)
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
            expect(flow) .withId( 'main' ) .toHaveAValueSuchThat( (value) => {
                expect( value ) .to .be .null
            })
        })

        it('sets the window title', () => {
            expect(flow) .withId( 'main.windowTitle' ) .toHaveAnObjectSuchThat( (object) => {
                expect( object ) .to .be .null
            })

            expect(flow) .withId( 'main.windowTitle' ) .toHaveAValueSuchThat( (title) => {
                expect( title ) .to .equal('App Browser - No folder selected.')
            })
        })

        it('sets the filesTree root', () => {
            const path = flow.getValue()

            expect(flow) .withId( 'main.filesTree' ) .toHaveRoots( [] )

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

            expect(flow) .withId( 'main.selectedFile' ) .toHaveAValueSuchThat( (value) => {
                expect( value.getFilePath() ) .to .match(/^.*tests[/]samples[/]class-definition.js$/)
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

            expect(flow) .withId( 'main.selectedFile' ) .toHaveAValueSuchThat( (value) => {
                expect( value ) .to .be .null
            })
        })
    })

})