const expect = require('chai').expect
const fileSamplesRepository = require('../fileSamplesRepository')
const namespace = require('../sirensNamespace')
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
        fileSamplesRepository.cleanUp()
        fileSamplesRepository.manageFile({ file: fileSample })

        filePath = fileSamplesRepository.pathTo( fileSample )
        sourceFile = namespace.SourceFile.new({ path: filePath  })
        sourceFileParser = namespace.SourceFileStructureParser.new()
        jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })
        jsMethod = jsFile.getMethods()[0]

        flow = namespace.JsMethodInspectorFlow.new()

        const commandsController =
            namespace.ApplicationCommandsController.new({ mainFlow: flow })
                .behaveAs( UnhandledBubbledUpCommandHandler )

        flow.setCommandsController( commandsController )

        // stub the .mainNamespace() for these tests since that namespace is
        // bubbled up and in the context of this tests FileInspectorFlow does
        // no have a parent flow.
        flow.setUnclassifiedProperty({
            name: 'mainNamespace',
            value: function() { return namespace }
        })        

        flow.acceptAllBubbledUps({
            defaultHandler: function({ commandName: commandName, params: params }) {
                return namespace
            }
        })
    })

    after( () => {
        fileSamplesRepository.cleanUp()
    })

    it('has all these child flows defined', () => {
        expect( flow ) .to .haveChildFlows([
            'main.methodSourceCode',
            'main.saveSelectedMethod',

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

            flow.updateMethodPlainComment({
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

            flow.updateMethodPlainComment({
                methodNewComment: methodComment
            })

            expect( flow ) .commandsController .to .haveReceived
                .aBubbledCommandsCountOf(1)

            expect( flow.getCommandsController() ) .to
                .haveReceived .aBubbledCommandAt({ index: 0 }) .suchThat ( (command) => {
                    expect(command.commandName) .to .eql('reloadSourceFile')
                    expect(command.startingAtFlow.getIdPath()) .to .eql('main')
                })
        })
    })
})