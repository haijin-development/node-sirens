const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const UnhandledBubbledUpCommandHandler = require('../../finger-tips/UnhandledBubbledUpCommandHandler')

const Sirens = require('../../../../src/Sirens')

const namespace = Sirens.namespace()


describe('When using an JsClassDocumentationFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let jsClass
    let classDocumentation
    let flow

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFile({ file: fileSample })

        filePath = FilesRepository.pathTo( fileSample )
        const sourceFile = namespace.SourceFile.new({ filepath: filePath  })
        const sourceFileParser = namespace.SourceFileStructureParser.new()
        const jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })

        jsClass = jsFile.getClasses()[0]
        classDocumentation =
            namespace.DocumentationReader.new().readClassDocumentationFrom({ jsClass: jsClass })

        flow = createClassDocumentationFlow()
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.documentationIndex',
            'main.documentationIndex.selectedDocumentationItem',

            'main.getClassDocumentation',
            'main.getClassName',
            'main.getClassDescription',
            'main.getClassImplementationNotes',
            'main.getClassExamples',
            'main.getSelectedDocumentationItemFlowPoint',
            'main.getSelectedDocumentationItemComponent',
            'main.isInEditionMode',
            'main.editClassDocumentationDescription',
            'main.createClassDocumentationImplementationNote',
            'main.editClassDocumentationImplementationNote',
            'main.deleteClassDocumentationImplementationNote',
            'main.createClassDocumentationExample',
            'main.editClassDocumentationExample',
            'main.deleteClassDocumentationExample',
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

            // stub the .mainNamespace() for these tests since that namespace is
            // bubbled up and in the context of this tests FileInspectorFlow does
            // no have a parent flow.
            classInspectorFlow.setUnclassifiedProperty({
                name: 'mainNamespace',
                value: function() { return namespace }
            })        

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
    const classDocumentationFlow = namespace.JsClassDocumentationFlow.new()

    const commandsController = namespace.ApplicationCommandsController.new({ mainFlow: classDocumentationFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    classDocumentationFlow.setCommandsController( commandsController )

    return classDocumentationFlow
}

function createClassInspectorFlow() {
    const classInspectorFlow = namespace.JsClassInspectorFlow.new()

    const commandsController = namespace.ApplicationCommandsController.new({ mainFlow: classInspectorFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    classInspectorFlow.setCommandsController( commandsController )

    return classInspectorFlow
}
