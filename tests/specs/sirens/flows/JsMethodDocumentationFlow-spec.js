const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const JsMethodDocumentationFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsMethodDocumentationFlow')
const JsMethodInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsMethodInspectorFlow')

const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')
const UnhandledBubbledUpCommandHandler = require('../../finger-tips/UnhandledBubbledUpCommandHandler')

describe('When using an JsMethodDocumentationFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let jsMethod
    let methodDocumentation
    let flow

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFile({ file: fileSample })

        filePath = FilesRepository.pathTo( fileSample )
        const sourceFile = SourceFile.new({ filepath: filePath  })
        const sourceFileParser = SourceFileStructureParser.new()
        const jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })

        jsMethod = jsFile.getMethods()[0]
        methodDocumentation = jsMethod.getDocumentation()

        flow = createMethodDocumentationFlow()
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.documentationIndex',
            'main.documentationIndex.selectedDocumentationItem',

            'main.flow-commands',
            'main.flow-commands.getSelectedDocumentationItemFlowPoint',
            'main.flow-commands.getSelectedDocumentationItemComponent',
            'main.flow-commands.getMethodDocumentation',
            'main.flow-commands.getMethodExamples',
            'main.flow-commands.getMethodImplementationNotes',
            'main.flow-commands.getMethodParams',
            'main.flow-commands.getMethodReturnValue',
            'main.flow-commands.getMethodDescription',
            'main.flow-commands.getMethodSignature',
            'main.flow-commands.getTagsSortedByPriority',
            'main.flow-commands.isInEditionMode',
            'main.flow-commands.createMethodDocumentationExample',
            'main.flow-commands.createMethodDocumentationImplementationNote',
            'main.flow-commands.createMethodDocumentationParam',
            'main.flow-commands.editMethodDocumentationDescription',
            'main.flow-commands.editMethodDocumentationExample',
            'main.flow-commands.editMethodDocumentationImplementationNote',
            'main.flow-commands.editMethodDocumentationParam',
            'main.flow-commands.editMethodDocumentationReturnValue',
            'main.flow-commands.editMethodTags',
            'main.flow-commands.deleteMethodDocumentationImplementationNote',
            'main.flow-commands.deleteMethodDocumentationParam',
            'main.flow-commands.deleteMethodDocumentationExample',
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
    const documentationFlow = JsMethodDocumentationFlow.new()

    const commandsController = ApplicationCommandsController.new({ mainFlow: documentationFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    documentationFlow.setCommandsController( commandsController )

    return documentationFlow
}

function createMethodInspectorFlow() {
    const methodInspectorFlow = JsMethodInspectorFlow.new()

    const commandsController = ApplicationCommandsController.new({ mainFlow: methodInspectorFlow })
        .behaveAs( UnhandledBubbledUpCommandHandler )

    methodInspectorFlow.setCommandsController( commandsController )

    return methodInspectorFlow
}
