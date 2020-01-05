const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')

const SirensNamespace = require('../../../../src/sirens/SirensNamespace')

const namespace = SirensNamespace.new()

const JsClassInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsClassInspectorFlow')

const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')
const UnhandledBubbledUpCommandHandler = require('../../finger-tips/UnhandledBubbledUpCommandHandler')

describe('When using an JsClassInspectorFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let filePath
    let sourceFile
    let sourceFileParser
    let jsFile
    let jsClass
    let flow

    beforeEach( () => {
        FilesRepository.cleanUp()
        FilesRepository.manageFile({ file: fileSample })

        filePath = FilesRepository.pathTo( fileSample )
        sourceFile = namespace.SourceFile.new({ filepath: filePath  })
        sourceFileParser = namespace.SourceFileStructureParser.new()
        jsFile = sourceFileParser.parseSourceFile({ sourceFile: sourceFile })
        jsClass = jsFile.getClasses()[0]

        flow = JsClassInspectorFlow.new()

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
            'main.classMethods',
            'main.classMethods.selectedMethod',
            'main.selectedTags',

            'main.getClass',
            'main.getMethodUnformattedComment',
            'main.getAllMethodsTagLabels',
            'main.showsUnformattedComments',
            'main.isInEditionMode',
            'main.editClassUnformattedComment',
            'main.isBrowsingDocumentation',
            'main.setIsBrowsingDocumentation',

            'main.classDocumentation',
            'main.classDocumentation.documentationIndex',
            'main.classDocumentation.documentationIndex.selectedDocumentationItem',

            'main.classDocumentation.getClassDocumentation',
            'main.classDocumentation.getClassName',
            'main.classDocumentation.getClassDescription',
            'main.classDocumentation.getClassImplementationNotes',
            'main.classDocumentation.getClassExamples',
            'main.classDocumentation.getSelectedDocumentationItemFlowPoint',
            'main.classDocumentation.getSelectedDocumentationItemComponent',
            'main.classDocumentation.isInEditionMode',
            'main.classDocumentation.createClassDocumentationExample',
            'main.classDocumentation.createClassDocumentationImplementationNote',
            'main.classDocumentation.editClassDocumentationDescription',
            'main.classDocumentation.editClassDocumentationExample',
            'main.classDocumentation.editClassDocumentationImplementationNote',
            'main.classDocumentation.deleteClassDocumentationImplementationNote',
            'main.classDocumentation.deleteClassDocumentationExample',
        ])
    })

    describe('when setting a jsClass', () => {
        beforeEach( () => {
            flow.setInspectedObject( jsClass )
        })

        it('the main flow has the jsClass', () => {
            expect( flow ) .withId( 'main' ) .to .haveValue( jsClass )
        })

        it('sets the class methods', () => {
            const expectedMethods = jsClass.getMethods()

            expect( flow ) .withId( 'main.classMethods' )
                .to .haveChoices( expectedMethods )
        })

        it('sets the selected method in null', () => {
            const expectedMethods = jsClass.getMethods()

            expect( flow ) .withId( 'main.classMethods.selectedMethod' )
                .to .haveValue( null )
        })

        it('sets the class documentation', () => {
            expect( flow ) .withId( 'main.classDocumentation' ) .withValue .suchThat( (classDocumentation) => {
                expect( classDocumentation ) .to .behaveAs( 'ClassDocumentation' )                
            })
        })
    })

    describe('when setting a null jsClass', () => {
        beforeEach( () => {
            flow.setInspectedObject( jsClass )

            flow.setInspectedObject( null )
        })

        it('sets the class methods to []', () => {
            const expectedMethods = []

            expect( flow ) .withId( 'main.classMethods' )
                .to .haveChoices( expectedMethods )
        })

        it('sets the selected method in null', () => {
            const expectedMethods = jsClass.getMethods()

            expect( flow ) .withId( 'main.classMethods.selectedMethod' )
                .to .haveValue( null )
        })

        it('sets the class documentation to null', () => {
            expect( flow ) .withId( 'main.classDocumentation' ) .to .haveValue( null )
        })

    })

    describe('when updating the documentation', () => {
        beforeEach( () => {
            flow.setInspectedObject( jsClass )
        })

        it('writes the updated comment to the file', () => {
            const classComment = '/* An updated class comment */'

            flow.updateClassUnformattedComment({
                classNewComment: classComment
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .not .to .match(/ A class comment/)
            })

            expect(filePath) .withFileContents .suchThat( (fileContents) => {
                expect(fileContents) .to .match(/[/][*] An updated class comment [*][/]/)
            })
        })

        it('calls the reloadSourceFile callback', () => {
            const classComment = '/* An updated comment */'

            flow.updateClassUnformattedComment({
                classNewComment: classComment
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