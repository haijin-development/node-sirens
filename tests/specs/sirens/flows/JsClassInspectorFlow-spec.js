const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const JsClassInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsClassInspectorFlow')

const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
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
        sourceFile = SourceFile.new({ filepath: filePath  })
        sourceFileParser = SourceFileStructureParser.new()
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

            'main.flow-commands',
            'main.flow-commands.getClass',
            'main.flow-commands.getMethodUnformattedComment',
            'main.flow-commands.getAllMethodsTagLabels',
            'main.flow-commands.showsUnformattedComments',
            'main.flow-commands.isInEditionMode',
            'main.flow-commands.editClassUnformattedComment',
            'main.flow-commands.isBrowsingDocumentation',
            'main.flow-commands.setIsBrowsingDocumentation',

            'main.classDocumentation',
            'main.classDocumentation.documentationIndex',
            'main.classDocumentation.documentationIndex.selectedDocumentationItem',

            'main.classDocumentation.flow-commands',
            'main.classDocumentation.flow-commands.getClassDocumentation',
            'main.classDocumentation.flow-commands.getClassName',
            'main.classDocumentation.flow-commands.getClassDescription',
            'main.classDocumentation.flow-commands.getClassImplementationNotes',
            'main.classDocumentation.flow-commands.getClassExamples',
            'main.classDocumentation.flow-commands.getSelectedDocumentationItemFlowPoint',
            'main.classDocumentation.flow-commands.getSelectedDocumentationItemComponent',
            'main.classDocumentation.flow-commands.isInEditionMode',
            'main.classDocumentation.flow-commands.createClassDocumentationExample',
            'main.classDocumentation.flow-commands.createClassDocumentationImplementationNote',
            'main.classDocumentation.flow-commands.editClassDocumentationDescription',
            'main.classDocumentation.flow-commands.editClassDocumentationExample',
            'main.classDocumentation.flow-commands.editClassDocumentationImplementationNote',
            'main.classDocumentation.flow-commands.deleteClassDocumentationImplementationNote',
            'main.classDocumentation.flow-commands.deleteClassDocumentationExample',
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