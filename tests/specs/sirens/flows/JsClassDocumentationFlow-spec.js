const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const JsClassDocumentationFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsClassDocumentationFlow')
const JsClassInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsClassInspectorFlow')

const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')
const UnhandledBubbledUpCommandHandler = require('../../finger-tips/UnhandledBubbledUpCommandHandler')

describe('When using an JsClassDocumentationFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let jsClass
    let classDocumentation
    let flow

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFile({ file: fileSample })

        filePath = FilesRepository.pathTo( fileSample )
        const sourceFile = SourceFile.new({ filepath: filePath  })
        const sourceFileParser = SourceFileStructureParser.new()
        const jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })

        jsClass = jsFile.getClasses()[0]
        classDocumentation = jsClass.getDocumentation()

        flow = createClassDocumentationFlow()
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.documentationIndex',
            'main.documentationIndex.selectedDocumentationItem',

            'main.flow-commands',
            'main.flow-commands.getClassDocumentation',
            'main.flow-commands.getClassName',
            'main.flow-commands.getClassDescription',
            'main.flow-commands.getClassImplementationNotes',
            'main.flow-commands.getClassExamples',
            'main.flow-commands.getSelectedDocumentationItemFlowPoint',
            'main.flow-commands.getSelectedDocumentationItemComponent',
            'main.flow-commands.isInEditionMode',
            'main.flow-commands.editClassDocumentationDescription',
            'main.flow-commands.createClassDocumentationImplementationNote',
            'main.flow-commands.editClassDocumentationImplementationNote',
            'main.flow-commands.deleteClassDocumentationImplementationNote',
            'main.flow-commands.createClassDocumentationExample',
            'main.flow-commands.editClassDocumentationExample',
            'main.flow-commands.deleteClassDocumentationExample',
        ])
    })

    describe('when setting a classDocumentation', () => {
        beforeEach( () => {
            flow.setValue(classDocumentation)
        })

        it('the main flow has the jsClass', () => {
            expect( flow ) .withId( 'main' ) .to .haveValue( classDocumentation )
        })
    })

    describe('exported commands', () => {
        let flowPoint

        beforeEach( () => {
            flowPoint = flow.asFlowPoint()

            flow.setValue( classDocumentation )
        })

        it('.getClassDocumentation() returns the current method documentation', () => {
            expect( flowPoint.getClassDocumentation() ) .to .equal( classDocumentation )
        })

        it('.isInEditionMode() bubbles the command up', () => {
            flowPoint.isInEditionMode()

            expect( flow ) .commandsController .to .haveReceived
                .aBubbledCommandsCountOf(1)

            expect( flow.getCommandsController() ) .to
                .haveReceived .aBubbledCommandAt({ index: 0 }) .suchThat ( (command) => {
                    expect(command.commandName) .to .eql('isEditingDocumentation')
                    expect(command.params) .to .eql([])
                    expect(command.startingAtFlow.getIdPath()) .to .eql('main')
                })
        })
    })

    describe('when updating the method documentation', () => {
        beforeEach( () => {
            const classInspectorFlow = createClassInspectorFlow()

            classInspectorFlow.setInspectedObject( jsClass )

            flow = classInspectorFlow.getChildFlow({ id: 'classDocumentation' })
        })

        it('updateClassDocumentationDescription writes the method comment to the file', () => {
            flow.updateClassDocumentationDescription({
                classNewDescription: 'New description',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Class[(].*New description.*[)]/ms)
            })
        })


        it('addClassDocumentationImplementationNote writes the method comment to the file', () => {
            flow.addClassDocumentationImplementationNote({
                implementationNoteText: 'New implementation note.',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Implementation[(].*New implementation note.*[)]/ms)
            })
        })

        it('updateClassDocumentationImplementationNote writes the method comment to the file', () => {
            flow.addClassDocumentationImplementationNote({
                implementationNoteText: 'New implementation note.',
            })

            const implementationNote = flow.getClassImplementationNotes()[0]

            flow.updateClassDocumentationImplementationNote({
                implementationNote: implementationNote,
                implementationNoteText: 'Updated implementation note.',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Implementation[(].*Updated implementation note.*[)]/ms)
            })
        })

        it('addclassDocumentationExample writes the method comment to the file', () => {
            flow.addClassDocumentationExample({
                description: 'An example',
                code: '// A code'
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Example[(].*An example.*A code.*[)]/ms)
            })
        })

        it('updateclassDocumentationExample writes the method comment to the file', () => {
            flow.addClassDocumentationExample({
                description: 'An example',
                code: '// A code'
            })

            const example = flow.getClassExamples()[0]

            flow.updateClassDocumentationExample({
                example: example,
                description: 'An updated example',
                code: '// An updated code'
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Example[(].*An updated example.*An updated code.*[)]/ms)
            })
        })
    })
})

function createClassDocumentationFlow() {
    const classDocumentationFlow = JsClassDocumentationFlow.new()

    const commandsController = ApplicationCommandsController.new({ mainFlow: classDocumentationFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    classDocumentationFlow.setCommandsController( commandsController )

    return classDocumentationFlow
}

function createClassInspectorFlow() {
    const classInspectorFlow = JsClassInspectorFlow.new()

    const commandsController = ApplicationCommandsController.new({ mainFlow: classInspectorFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    classInspectorFlow.setCommandsController( commandsController )

    return classInspectorFlow
}
