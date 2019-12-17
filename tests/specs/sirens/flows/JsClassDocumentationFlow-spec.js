const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const JsClassDocumentationFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsClassDocumentationFlow')
const JsClassInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsClassInspectorFlow')

const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')

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

        flow = JsClassDocumentationFlow.new({
            updateClassDocumentationClosure: () => {}
        })
        flow.setCommandsController( ApplicationCommandsController.new({ mainFlow: flow }) )
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.flow-commands',
            'main.flow-commands.getClassDocumentation',
            'main.flow-commands.isInEditionMode',
            'main.flow-commands.editClassDocumentationDescription',
            'main.flow-commands.createClassDocumentationImplementationNote',
            'main.flow-commands.editClassDocumentationImplementationNote',
            'main.flow-commands.createClassDocumentationExample',
            'main.flow-commands.editClassDocumentationExample',
        ])
    })

    describe('when setting a classDocumentation', () => {
        beforeEach( () => {
            flow.setValue({
                classDocumentation: classDocumentation,
                isEditingDocumentation: true,
            })
        })

        it('the main flow has the jsClass', () => {
            expect( flow ) .withId( 'main' ) .toHaveAValueSuchThat( (value) => {
                expect( value.classDocumentation ) .to .equal( classDocumentation )
                expect( value.isEditingDocumentation ) .to .be .true
            })
        })
    })

    describe('exported commands', () => {
        let flowPoint

        beforeEach( () => {
            flowPoint = flow.asFlowPoint()

            flow.setValue({
                classDocumentation: classDocumentation,
                isEditingDocumentation: false,
            })
        })

        it('.getClassDocumentation() returns the current method documentation', () => {
            expect( flowPoint.getClassDocumentation() ) .to .equal( classDocumentation )
        })

        it('.isInEditionMode() returns if the flow is in edition mode', () => {
            expect( flowPoint.isInEditionMode() ) .to .equal( false )

            flow.setValue({
                classDocumentation: classDocumentation,
                isEditingDocumentation: true,
            })

            expect( flowPoint.isInEditionMode() ) .to .equal( true )
        })
    })

    describe('when updating the method documentation', () => {
        beforeEach( () => {
            const classInspectorFlow = JsClassInspectorFlow.new()

            classInspectorFlow.setInspectedObject({
                object: jsClass,
                isEditingDocumentation: false,
                showsUnformattedComments: false,
                reloadSourceFile: () => {},
            })

            flow = JsClassDocumentationFlow.new({
                updateClassDocumentationClosure:
                    classInspectorFlow.updateClassDocumentation.bind(classInspectorFlow),
            })

            flow.setCommandsController( ApplicationCommandsController.new({ mainFlow: flow }) )

            flow.setValue({
                classDocumentation: classDocumentation,
                isEditingDocumentation: true,
            })
        })

        it('updateClassDocumentationDescription writes the method comment to the file', () => {
            flow.updateClassDocumentationDescription({
                classNewDescription: 'New description',
            })

            expect(filePath) .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .to .match(/Class[(].*New description.*[)]/ms)
            })
        })


        it('addClassDocumentationImplementationNote writes the method comment to the file', () => {
            flow.addClassDocumentationImplementationNote({
                implementationNoteText: 'New implementation note.',
            })

            expect(filePath) .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .to .match(/Implementation[(].*New implementation note.*[)]/ms)
            })
        })

        it('updateClassDocumentationImplementationNote writes the method comment to the file', () => {
            flow.addClassDocumentationImplementationNote({
                implementationNoteText: 'New implementation note.',
            })

            flow.updateClassDocumentationImplementationNote({
                atIndex: 0, implementationNoteText: 'Updated implementation note.',
            })

            expect(filePath) .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .to .match(/Implementation[(].*Updated implementation note.*[)]/ms)
            })
        })

        it('addclassDocumentationExample writes the method comment to the file', () => {
            flow.addClassDocumentationExample({
                example: {
                    Description: 'An example',
                    Code: '// A code'
                },
            })

            expect(filePath) .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .to .match(/Example[(].*An example.*A code.*[)]/ms)
            })
        })

        it('updateclassDocumentationExample writes the method comment to the file', () => {
            flow.addClassDocumentationExample({
                example: {
                    Description: 'An example',
                    Code: '// A code'
                },
            })

            flow.updateClassDocumentationExample({
                atIndex: 0,
                example: {
                    Description: 'An updated example',
                    Code: '// An updated code'
                },
            })

            expect(filePath) .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .to .match(/Example[(].*An updated example.*An updated code.*[)]/ms)
            })
        })
    })
})