const expect = require('chai').expect
const FileInspectorFlow = require('../../../../src/sirens/flows/file-inspector/FileInspectorFlow')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')

const sourceFile = SourceFile.new({ filepath:  __dirname + '/../../../samples/class-definition.js' })

describe('When using an FileInspectorFlow', () => {
    it('has all these child flows defined', () => {

        const flow = FileInspectorFlow.new()

        expect( flow ) .to .haveChildFlows([
            'main.fileObjects',
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

        it('sets the SourceFile sections to the fileObjects flow', () => {
            const fileObject = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.fileObjects' ) .toHaveRoots( [fileObject] )
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            const fileObject = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.fileObjects' ) .toHaveSelection( [fileObject] )
        })

        it('sets the selectedSectionContents to the first fileObject', () => {
            const fileObject = sourceFile.getFileStructure()

            expect(flow) .withId( 'main.selectedSectionContents' ) .toHaveValue( fileObject )
        })

        it('sets the methods list', () => {
            const fileObject = sourceFile.getFileStructure()

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

        it('sets the SourceFile sections to the fileObjects flow', () => {
            expect(flow) .withId( 'main.fileObjects' ) .toHaveRoots( [] )
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .toHaveSelection( [] )
        })

        it('sets the selectedSectionContents to the first fileObject', () => {
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

            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[0]

            flow.getChildFlow({ id: 'fileObjects' }).setSelection([ fileObject, classSection ])
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[0]

            expect(flow) .withId( 'main.fileObjects' ) .toHaveSelection([
                fileObject, classSection
            ])
        })

        it('sets the selectedSectionContents to the first fileObject', () => {
            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[0]

            expect(flow) .withId( 'main.selectedSectionContents' ) .toHaveValue( classSection )
        })

        it('sets the methods list', () => {
            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[0]

            const methods = classSection.getChildObjects()

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

            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[0]

            flow.getChildFlow({ id: 'fileObjects' }).setSelection([ fileObject, classSection ])
            flow.getChildFlow({ id: 'fileObjects' }).setSelection(null)
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .toHaveSelection( [] )
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

            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[1]

            const methods = classSection.getChildObjects()

            flow.getChildFlow({ id: 'selectedSectionContents.classMethods' })
                .setSelection( methods[1] )
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

            const fileObject = sourceFile.getFileStructure()
            const classSection = fileObject.getChildObjects()[0]

            const methods = classSection.getChildObjects()

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