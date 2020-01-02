const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const JsMethodInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsMethodInspectorFlow')

const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')
const UnhandledBubbledUpCommandHandler = require('../../finger-tips/UnhandledBubbledUpCommandHandler')

describe('When using an JsMethodInspectorFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let filePath
    let sourceFile
    let sourceFileParser
    let jsFile
    let jsMethod
    let flow

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFile({ file: fileSample })

        filePath = FilesRepository.pathTo( fileSample )
        sourceFile = SourceFile.new({ filepath: filePath  })
        sourceFileParser = SourceFileStructureParser.new()
        jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })
        jsMethod = jsFile.getMethods()[0]

        flow = JsMethodInspectorFlow.new()

        const commandsController =
            ApplicationCommandsController.new({ mainFlow: flow })
                .behaveAs( UnhandledBubbledUpCommandHandler )

        flow.setCommandsController( commandsController )
    })

    after( () => {
        FilesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.methodSourceCode',

            'main.showsUnformattedComments',
            'main.getMethod',
            'main.getMethodSignature',
            'main.getMethodUnformattedComment',
            'main.isInEditionMode',
            'main.editMethodUnformattedComment',
            'main.isBrowsingDocumentation',
            'main.setIsBrowsingDocumentation',

            'main.methodDocumentation',
            'main.methodDocumentation.documentationIndex',
            'main.methodDocumentation.documentationIndex.selectedDocumentationItem',

            'main.methodDocumentation.getMethodDocumentation',
            'main.methodDocumentation.getMethodExamples',
            'main.methodDocumentation.getMethodImplementationNotes',
            'main.methodDocumentation.getMethodParams',
            'main.methodDocumentation.getMethodReturnValue',
            'main.methodDocumentation.getSelectedDocumentationItemFlowPoint',
            'main.methodDocumentation.getSelectedDocumentationItemComponent',
            'main.methodDocumentation.getMethodDescription',
            'main.methodDocumentation.getMethodSignature',
            'main.methodDocumentation.getTagsSortedByPriority',
            'main.methodDocumentation.isInEditionMode',
            'main.methodDocumentation.createMethodDocumentationExample',
            'main.methodDocumentation.createMethodDocumentationImplementationNote',
            'main.methodDocumentation.createMethodDocumentationParam',
            'main.methodDocumentation.editMethodDocumentationDescription',
            'main.methodDocumentation.editMethodDocumentationExample',
            'main.methodDocumentation.editMethodDocumentationImplementationNote',
            'main.methodDocumentation.editMethodDocumentationParam',
            'main.methodDocumentation.editMethodDocumentationReturnValue',
            'main.methodDocumentation.editMethodTags',
            'main.methodDocumentation.deleteMethodDocumentationImplementationNote',
            'main.methodDocumentation.deleteMethodDocumentationParam',
            'main.methodDocumentation.deleteMethodDocumentationExample',
        ])
    })

    describe('when setting a jsMethod', () => {
        beforeEach( () => {
            flow.setInspectedObject( jsMethod )
        })

        it('the main flow has the jsMethod', () => {
            expect( flow ) .withId( 'main' ) .to .haveValue( jsMethod )
        })

        it('sets the formatted source code', () => {
            const expectedSourceCode =
`function modFunction() {
    return 'A standalone function'
}`

            expect( flow ) .withId( 'main.methodSourceCode' ) .to .haveValue( expectedSourceCode )
        })

        it('sets the method documentation', () => {
            expect( flow ) .withId( 'main.methodDocumentation' ) .withValue .suchThat( (methodDocumentation) => {
                expect( methodDocumentation ) .to .behaveAs( 'MethodDocumentation' )                
            })
        })
    })

    describe('when setting a null jsMethod', () => {
        beforeEach( () => {
            flow.setInspectedObject( jsMethod )

            flow.setInspectedObject( null )
        })

        it('the main flow has null', () => {
            expect( flow ) .withId( 'main' ) .to .haveValue( null )
        })

        it('sets an empty formatted source code', () => {
            const expectedSourceCode = ''

            expect( flow ) .withId( 'main.methodSourceCode' ) .to .haveValue( expectedSourceCode )
        })

        it('sets a null method documentation', () => {
            expect( flow ) .withId( 'main.methodDocumentation' ) .to .haveValue( null )
        })

    })

    describe('when updating the documentation', () => {
        beforeEach( () => {
            flow.setInspectedObject( jsMethod )
        })

        it('writes the updated comment to the file', () => {
            const methodComment = '/* An updated comment */'

            flow.updateMethodUnformmatedComment({
                methodNewComment: methodComment
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .not .to .match(/A method comment/)
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/[/][*] An updated comment [*][/]/)
            })
        })

        it('calls the reloadSourceFile callback', () => {
            const methodComment = '/* An updated comment */'

            flow.updateMethodUnformmatedComment({
                methodNewComment: methodComment
            })

            expect( flow ) .commandsController .to .haveReceived
                .aBubbledCommandsCountOf(1)

            expect( flow.getCommandsController() ) .to
                .haveReceived .aBubbledCommandAt({ index: 0 }) .suchThat ( (command) => {
                    expect(command.commandName) .to .eql('reloadSourceFile')
                    expect(command.params) .to .eql([])
                    expect(command.startingAtFlow.getIdPath()) .to .eql('main')
                })
        })
    })
})