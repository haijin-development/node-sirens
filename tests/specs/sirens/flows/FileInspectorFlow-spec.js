const expect = require('chai').expect
const FileInspectorFlow = require('../../../../src/sirens/flows/class-inspector/FileInspectorFlow')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const sourceFile = SourceFile.new({ filepath:  __dirname + '/../../../samples/class-definition.js' })

describe('When using an FileInspectorFlow', () => {
    it('has all these child flows defined', () => {

        const flow = FileInspectorFlow.new()

        expect( flow ) .to .haveChildFlows([
            'main.fileSections',
            'main.selectedSectionContents',
            'main.selectedSectionContents.classMethods',
            'main.selectedSectionContents.selectedMethod',

            'main.getSourceFile',
            'main.selectedSectionContents.openClassDocumentation',
        ])
    })

    describe('when setting a SourceFile', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })
        })

        it('sets the SourceFile to the main flow', () => {
            expect(flow) .withId( 'main' ) .toHaveAValueSuchThat( (value) => {
                expect( value.getFilePath() ) .to .match(/^.*tests[/]samples[/]class-definition[.]js$/)
            })
        })

        it('sets the SourceFile sections to the fileSections flow', () => {
            const fileSection = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.fileSections' ) .toHaveRoots( [fileSection] )
        })

        it('sets the SourceFile sections selection to the first fileSection', () => {
            const fileSection = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.fileSections' ) .toHaveSelection( [fileSection] )
        })

        it('sets the selectedSectionContents to the first fileSection', () => {
            const fileSection = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.selectedSectionContents' ) .toHaveValue( fileSection )
        })

        it('sets the methods list', () => {
            const fileSection = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.selectedSectionContents.classMethods' )
                .toHaveChoices( [] )
        })

        it('sets the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedSectionContents.selectedMethod' )
                .toHaveValue( '' )
        })

    })

    describe('when setting a null SourceFile', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })
            flow.setSourceFile({ sourceFile: null })
        })

        it('sets the SourceFile to the main flow', () => {
            expect(flow) .withId( 'main' ) .toHaveValue( null )
        })

        it('sets the SourceFile sections to the fileSections flow', () => {
            expect(flow) .withId( 'main.fileSections' ) .toHaveRoots( [] )
        })

        it('sets the SourceFile sections selection to the first fileSection', () => {
            expect(flow) .withId( 'main.fileSections' ) .toHaveSelection( [] )
        })

        it('sets the selectedSectionContents to the first fileSection', () => {
            expect(flow) .withId( 'main.selectedSectionContents' ) .toHaveValue( null )
        })

        it('sets the methods list', () => {
            expect(flow) .withId( 'main.selectedSectionContents.classMethods' )
                .toHaveChoices( [] )
        })

        it('sets the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedSectionContents.selectedMethod' )
                .toHaveValue( '' )
        })

    })


    describe('when selecting a JsClassSection', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })            

            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            flow.getChildFlow({ id: 'fileSections' }).setSelection([ fileSection, classSection ])
        })

        it('sets the SourceFile sections selection to the first fileSection', () => {
            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            expect(flow) .withId( 'main.fileSections' ) .toHaveSelection([
                fileSection, classSection
            ])
        })

        it('sets the selectedSectionContents to the first fileSection', () => {
            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            expect(flow) .withId( 'main.selectedSectionContents' ) .toHaveValue( classSection )
        })

        it('sets the methods list', () => {
            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            const methods = classSection.getChildSections()

            expect(flow) .withId( 'main.selectedSectionContents.classMethods' )
                .toHaveChoices( methods )
        })

        it('clears the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedSectionContents.selectedMethod' )
                .toHaveValue( '' )
        })

    })

    describe('when selecting a null JsClassSection', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })            

            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            flow.getChildFlow({ id: 'fileSections' }).setSelection([ fileSection, classSection ])
            flow.getChildFlow({ id: 'fileSections' }).setSelection(null)
        })

        it('sets the SourceFile sections selection to the first fileSection', () => {
            expect(flow) .withId( 'main.fileSections' ) .toHaveSelection( [] )
        })

        it('sets the selectedSectionContents to null', () => {
            expect(flow) .withId( 'main.selectedSectionContents' ) .toHaveValue( null )
        })

        it('sets an empty methods list', () => {
            expect(flow) .withId( 'main.selectedSectionContents.classMethods' )
                .toHaveChoices( [] )
        })

        it('clears the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedSectionContents.selectedMethod' )
                .toHaveValue( '' )
        })

    })

    describe('when selecting a JsMethod', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })            

            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            const methods = classSection.getChildSections()

            flow.getChildFlow({ id: 'selectedSectionContents.classMethods' })
                .setSelection( methods[0] )
        })

        it('sets the selected method contents in the inspector', () => {
            expect(flow) .withId( 'main.selectedSectionContents.selectedMethod' )
                .toHaveValue(
`getName() {
    return this.name
}`
                )
        })

    })

    describe('when selecting a null JsMethod', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })            

            const fileSection = sourceFile.getFileStructure()
            const classSection = fileSection.getChildSections()[0]

            const methods = classSection.getChildSections()

            flow.getChildFlow({ id: 'selectedSectionContents.classMethods' })
                .setSelection( methods[0] )

            flow.getChildFlow({ id: 'selectedSectionContents.classMethods' })
                .setSelection( null )
        })

        it('clears the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedSectionContents.selectedMethod' )
                .toHaveValue('')
        })

    })

})