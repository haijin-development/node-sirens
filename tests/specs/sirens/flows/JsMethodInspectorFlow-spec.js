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

            'main.flow-commands',
            'main.flow-commands.showsUnformattedComments',
            'main.flow-commands.getMethod',
            'main.flow-commands.getMethodSignature',
            'main.flow-commands.getMethodUnformattedComment',
            'main.flow-commands.isInEditionMode',
            'main.flow-commands.editMethodUnformattedComment',
            'main.flow-commands.isBrowsingDocumentation',
            'main.flow-commands.setIsBrowsingDocumentation',

            'main.methodDocumentation',
            'main.methodDocumentation.documentationIndex',
            'main.methodDocumentation.documentationIndex.selectedDocumentationItem',

            'main.methodDocumentation.flow-commands',
            'main.methodDocumentation.flow-commands.getMethodDocumentation',
            'main.methodDocumentation.flow-commands.getMethodExamples',
            'main.methodDocumentation.flow-commands.getMethodImplementationNotes',
            'main.methodDocumentation.flow-commands.getMethodParams',
            'main.methodDocumentation.flow-commands.getMethodReturnValue',
            'main.methodDocumentation.flow-commands.getSelectedDocumentationItemFlowPoint',
            'main.methodDocumentation.flow-commands.getSelectedDocumentationItemComponent',
            'main.methodDocumentation.flow-commands.getMethodDescription',
            'main.methodDocumentation.flow-commands.getMethodSignature',
            'main.methodDocumentation.flow-commands.getTagsSortedByPriority',
            'main.methodDocumentation.flow-commands.isInEditionMode',
            'main.methodDocumentation.flow-commands.createMethodDocumentationExample',
            'main.methodDocumentation.flow-commands.createMethodDocumentationImplementationNote',
            'main.methodDocumentation.flow-commands.createMethodDocumentationParam',
            'main.methodDocumentation.flow-commands.editMethodDocumentationDescription',
            'main.methodDocumentation.flow-commands.editMethodDocumentationExample',
            'main.methodDocumentation.flow-commands.editMethodDocumentationImplementationNote',
            'main.methodDocumentation.flow-commands.editMethodDocumentationParam',
            'main.methodDocumentation.flow-commands.editMethodDocumentationReturnValue',
            'main.methodDocumentation.flow-commands.editMethodTags',
            'main.methodDocumentation.flow-commands.deleteMethodDocumentationImplementationNote',
            'main.methodDocumentation.flow-commands.deleteMethodDocumentationParam',
            'main.methodDocumentation.flow-commands.deleteMethodDocumentationExample',
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