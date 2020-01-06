const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const UnhandledBubbledUpCommandHandler = require('../../finger-tips/UnhandledBubbledUpCommandHandler')

const Sirens = require('../../../../src/Sirens')

const namespace = Sirens.namespace()

describe('When using an JsMethodDocumentationFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let jsMethod
    let methodDocumentation
    let flow

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFile({ file: fileSample })

        filePath = FilesRepository.pathTo( fileSample )
        const sourceFile = namespace.SourceFile.new({ filepath: filePath  })
        const sourceFileParser = namespace.SourceFileStructureParser.new()
        const jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })

        jsMethod = jsFile.getMethods()[0]

        methodDocumentation = namespace.DocumentationReader.new()
            .readMethodDocumentationFrom({ jsMethod: jsMethod })

        flow = createMethodDocumentationFlow()
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.documentationIndex',
            'main.documentationIndex.selectedDocumentationItem',

            'main.getSelectedDocumentationItemFlowPoint',
            'main.getSelectedDocumentationItemComponent',
            'main.getMethodDocumentation',
            'main.getMethodExamples',
            'main.getMethodImplementationNotes',
            'main.getMethodParams',
            'main.getMethodReturnValue',
            'main.getMethodDescription',
            'main.getMethodSignature',
            'main.getTagsSortedByPriority',
            'main.isInEditionMode',
            'main.createMethodDocumentationExample',
            'main.createMethodDocumentationImplementationNote',
            'main.createMethodDocumentationParam',
            'main.editMethodDocumentationDescription',
            'main.editMethodDocumentationExample',
            'main.editMethodDocumentationImplementationNote',
            'main.editMethodDocumentationParam',
            'main.editMethodDocumentationReturnValue',
            'main.editMethodTags',
            'main.deleteMethodDocumentationImplementationNote',
            'main.deleteMethodDocumentationParam',
            'main.deleteMethodDocumentationExample',
        ])
    })

    describe('when setting a methodDocumentation', () => {
        beforeEach( () => {
            flow.setValue( methodDocumentation )
        })

        it('the main flow has the jsMethod', () => {
            expect( flow ) .withId( 'main' ) .to .haveValue( methodDocumentation )
        })
    })

    describe('exported commands', () => {
        let flowPoint

        beforeEach( () => {
            flowPoint = flow.asFlowPoint()

            flow.setValue( methodDocumentation )
        })

        it('.getMethodDocumentation() returns the current method documentation', () => {
            expect( flowPoint.getMethodDocumentation() ) .to .equal( methodDocumentation )
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
        let methodInspectorFlow

        beforeEach( () => {
            methodInspectorFlow = createMethodInspectorFlow()

            // stub the .mainNamespace() for these tests since that namespace is
            // bubbled up and in the context of this tests FileInspectorFlow does
            // no have a parent flow.
            methodInspectorFlow.setUnclassifiedProperty({
                name: 'mainNamespace',
                value: function() { return namespace }
            })        

            methodInspectorFlow.setInspectedObject( jsMethod )

            flow = methodInspectorFlow.getChildFlow({ id: 'methodDocumentation' })
        })

        it('updateMethodDocumentationTags writes the method comment to the file', () => {
            flow.updateMethodDocumentationTags({
                newTags: [ 'tag1', 'tag2' ],
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Tags[(].*'tag1', 'tag2'.*[)]/ms)
            })
        })

        it('updateMethodDocumentationDescription writes the method comment to the file', () => {
            flow.updateMethodDocumentationDescription({
                methodNewDescription: 'New description',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Method[(].*New description.*[)]/ms)
            })
        })

        it('addMethodParam writes the method comment to the file', () => {
            flow.addMethodDocumentationParamFrom({
                name: 'A parameter',
                description: 'Description',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Param[(].*A parameter.*Description.*[)]/ms)
            })
        })

        it('updateMethodDocumentationParam writes the method comment to the file', () => {
            flow.addMethodDocumentationParamFrom({
                name: 'A parameter',
                description: 'Description',
            })

            const param = flow.getMethodParams()[0]

            flow.updateMethodDocumentationParam({
                param: param,
                name: 'An updated parameter',
                description: 'Updated description',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Param[(].*An updated parameter.*Updated description.*[)]/ms)
            })
        })

        it('addMethodDocumentationImplementationNote writes the method comment to the file', () => {
            flow.addMethodDocumentationImplementationNote({
                implementationNoteText: 'New implementation note.',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Implementation[(].*New implementation note.*[)]/ms)
            })
        })

        it('updateMethodDocumentationImplementationNote writes the method comment to the file', () => {
            flow.addMethodDocumentationImplementationNote({
                implementationNoteText: 'New implementation note.',
            })

            const implementationNote = flow.getMethodImplementationNotes()[0]

            flow.updateMethodDocumentationImplementationNote({
                implementationNote: implementationNote, implementationNoteText: 'Updated implementation note.',
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Implementation[(].*Updated implementation note.*[)]/ms)
            })
        })

        it('addMethodDocumentationExample writes the method comment to the file', () => {
            flow.addMethodDocumentationExample({
                description: 'An example',
                code: '// A code'
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/Example[(].*An example.*A code.*[)]/ms)
            })
        })

        it('updateMethodDocumentationExample writes the method comment to the file', () => {
            flow.addMethodDocumentationExample({
                description: 'An example',
                code: '// A code',
            })

            const example = flow.getMethodExamples()[0]

            flow.updateMethodDocumentationExample({
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

function createMethodDocumentationFlow() {
    const documentationFlow = namespace.JsMethodDocumentationFlow.new()

    const commandsController = namespace.ApplicationCommandsController.new({ mainFlow: documentationFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    documentationFlow.setCommandsController( commandsController )

    return documentationFlow
}

function createMethodInspectorFlow() {
    const methodInspectorFlow = namespace.JsMethodInspectorFlow.new()

    const commandsController = namespace.ApplicationCommandsController.new({ mainFlow: methodInspectorFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    methodInspectorFlow.setCommandsController( commandsController )

    return methodInspectorFlow
}
