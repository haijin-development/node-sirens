const expect = require('chai').expect
const FileInspectorFlow = require('../../../../src/sirens/flows/file-inspector/FileInspectorFlow')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const JsFileObject = require('../../../../src/sirens/objects/file-structure/JsFileObject')
const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')

const sourceFile = SourceFile.new({ filepath:  __dirname + '/../../../samples/class-definition.js' })
const sourceFileParser = SourceFileStructureParser.new()
const jsFile = sourceFileParser.parseStructureIn({ sourceFile: sourceFile })

describe('When using an FileInspectorFlow', () => {
    it('has all these child flows defined', () => {

        const flow = FileInspectorFlow.new()

        expect( flow ) .to .haveChildFlows([
            'main.fileObjects',

            'main.selectedFileObject',

            'main.flow-methods',
            'main.flow-methods.getFileObjectComponent',
            'main.flow-methods.getFileObjectInspectorFlow',
            'main.flow-methods.getSourceFile',
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
            expect(flow) .withId( 'main.fileObjects' ) .toHaveRootsSuchThat( (root) => {
                expect(root) .to .behaveAs( JsFileObject )
            })
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .toHaveASelectionSuchThat( (selection) =>{
                expect(selection.length) .to .equal( 1 )
                expect(selection[0]) .to .behaveAs( JsFileObject )
            })
        })

        it('sets the selectedFileObject to the first fileObject', () => {
            expect(flow) .withId( 'main.selectedFileObject' ) .toHaveAValueSuchThat( (value) => {
                expect(value) .to .behaveAs( JsFileObject )
            })
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

        it('sets the selectedFileObject to the first fileObject', () => {
            expect(flow) .withId( 'main.selectedFileObject' ) .toHaveValue( null )
        })

    })


    describe('when selecting a JsClassSection', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })            

            const jsClass = jsFile.getChildObjectAt({ index: 0 })

            flow.getChildFlow({ id: 'fileObjects' }).setSelection([ jsFile, jsClass ])
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            const jsClass = jsFile.getChildObjectAt({ index: 0 })

            expect(flow) .withId( 'main.fileObjects' ) .toHaveSelection(
                [ jsFile, jsClass ]
            )
        })

        it('sets the selectedFileObject to the first fileObject', () => {
            const jsClass = jsFile.getChildObjectAt({ index: 0 })

            expect(flow) .withId( 'main.selectedFileObject' ) .toHaveValue( jsClass )
        })

        xit('sets the methods list', () => {
            const jsClass = jsFile.getChildObjectAt({ index: 0 })

            const methods = jsClass.getChildObjects()

            expect(flow) .withId( 'main.selectedFileObject.classMethods' )
                .toHaveChoices( methods )
        })

        xit('clears the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedFileObject.selectedMethod' )
                .toHaveValue( '' )
        })

    })

    describe('when selecting a null JsClassSection', () => {
        let flow

        beforeEach( () => {
            flow = FileInspectorFlow.new()

            flow.setSourceFile({ sourceFile: sourceFile })            

            const jsClass = jsFile.getChildObjectAt({ index: 0 })

            flow.getChildFlow({ id: 'fileObjects' }).setSelection([ jsFile, jsClass ])
            flow.getChildFlow({ id: 'fileObjects' }).setSelection(null)
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .toHaveSelection( [] )
        })

        it('sets the selectedFileObject to null', () => {
            expect(flow) .withId( 'main.selectedFileObject' ) .toHaveValue( null )
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

            flow.getChildFlow({ id: 'selectedFileObject.classMethods' })
                .setSelection( methods[1] )
        })

        xit('sets the selected method contents in the inspector', () => {
            expect(flow) .withId( 'main.selectedFileObject.selectedMethod' )
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

            flow.getChildFlow({ id: 'selectedFileObject.classMethods' })
                .setSelection( methods[0] )

            flow.getChildFlow({ id: 'selectedFileObject.classMethods' })
                .setSelection( null )
        })

        xit('clears the selected method inspector', () => {
            expect(flow) .withId( 'main.selectedFileObject.selectedMethod' )
                .toHaveValue('')
        })

    })

})