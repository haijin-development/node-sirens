const expect = require('chai').expect
const AppBrowserFlow = require('../../../../src/sirens/flows/app-browser/AppBrowserFlow')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')


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
            'main.openClassEditor',
            'main.openPlayground',
            'main.openClassDocumentation',
            'main.pickFolder',
            'main.openFolder',
            'main.getSelectedFilePath',
            'main.hasAClassSelected',

            'main.sourceFileEdition',

            'main.sourceFileEdition.getSourceFile',
            'main.sourceFileEdition.fileSections',
            'main.sourceFileEdition.selectedSectionContents',
            'main.sourceFileEdition.selectedSectionContents.classMethods',
            'main.sourceFileEdition.selectedSectionContents.editedContents',
        ])
    })

    describe('when setting a folder', () => {
        let flow

        beforeEach( () => {
            flow = AppBrowserFlow.new()

            flow.openFolder({ folderPath: __dirname + '/../../../samples' })            
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

})