const expect = require('chai').expect
const FilesRepository = require('../FilesRepository')
const JsMethodInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/JsMethodInspectorFlow')

const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const ApplicationCommandsController = require('../../../../src/sirens/flows/ApplicationCommandsController')

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
        flow.setCommandsController( ApplicationCommandsController.new({ mainFlow: flow }) )
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
            'main.flow-commands.getMethodUnformattedComment',
            'main.flow-commands.isInEditionMode',
            'main.flow-commands.editMethodUnformmatedComment',

            'main.methodDocumentation',
            'main.methodDocumentation.flow-commands',
            'main.methodDocumentation.flow-commands.getMethodDocumentation',
            'main.methodDocumentation.flow-commands.isInEditionMode',
            'main.methodDocumentation.flow-commands.createMethodDocumentationExample',
            'main.methodDocumentation.flow-commands.createMethodDocumentationImplementationNote',
            'main.methodDocumentation.flow-commands.createMethodDocumentationParam',
            'main.methodDocumentation.flow-commands.editMethodDocumentationComment',
            'main.methodDocumentation.flow-commands.editMethodDocumentationExample',
            'main.methodDocumentation.flow-commands.editMethodDocumentationImplementationNote',
            'main.methodDocumentation.flow-commands.editMethodDocumentationParam',
            'main.methodDocumentation.flow-commands.editMethodDocumentationReturn',
            'main.methodDocumentation.flow-commands.editMethodTags',
        ])
    })

    describe('when setting a jsMethod', () => {
        beforeEach( () => {
            flow.setInspectedObject({
                object: jsMethod,
                showsUnformattedComments: false,
                isEditingDocumentation: false,
                reloadSourceFile: () => {},
            })
        })

        it('the main flow has the jsMethod', () => {
            expect( flow ) .withId( 'main' ) .toHaveAValueSuchThat( (value) => {
                expect(value.object) .to .equal( jsMethod )
                expect(value.showsUnformattedComments) .to .equal( false )
                expect(value.isEditingDocumentation) .to .equal( false )
            })
        })

        it('sets the formatted source code', () => {
            const expectedSourceCode =
`function modFunction() {
    return 'A standalone function'
}`

            expect( flow ) .withId( 'main.methodSourceCode' ) .toHaveValue( expectedSourceCode )
        })

        it('sets the method documentation', () => {
            expect( flow ) .withId( 'main.methodDocumentation' ) .toHaveAValueSuchThat( (value) => {
                expect( value.methodDocumentation ) .to .behaveAs( 'MethodDocumentation' )                
            })
        })
    })

    describe('when setting a null jsMethod', () => {
        beforeEach( () => {
            flow.setInspectedObject({
                object: jsMethod,
                showsUnformattedComments: false,
                isEditingDocumentation: false,
                reloadSourceFile: () => {},
            })

            flow.setInspectedObject({
                object: null,
                showsUnformattedComments: false,
                isEditingDocumentation: false,
                reloadSourceFile: () => {},
            })
        })

        it('the main flow has null', () => {
            expect( flow ) .withId( 'main' ) .toHaveAValueSuchThat( (value) => {
                expect(value.object) .to .equal( null )
                expect(value.isEditingDocumentation) .to .equal( false )
            })
        })

        it('sets an empty formatted source code', () => {
            const expectedSourceCode = ''

            expect( flow ) .withId( 'main.methodSourceCode' ) .toHaveValue( expectedSourceCode )
        })

        it('sets a null method documentation', () => {
            expect( flow ) .withId( 'main.methodDocumentation' ) .toHaveAValueSuchThat( (value) => {
                expect( value.methodDocumentation ) .to .be .null                
            })
        })

    })

    describe('when updating the documentation', () => {
        let reloadWasCalled

        beforeEach( () => {
            reloadWasCalled = false

            flow.setInspectedObject({
                object: jsMethod,
                showsUnformattedComments: false,
                isEditingDocumentation: false,
                reloadSourceFile: () => { reloadWasCalled = true },
            })
        })

        it('writes the updated comment to the file', () => {
            const methodComment = '/* An updated comment */'

            flow.updateMethodUnformmatedComment({
                methodNewComment: methodComment
            })

            expect(filePath) .not .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .not .to .match(/A method comment/)
            })

            expect(filePath) .to .haveFileContentsSuchThat( (fileContents) => {
                expect(fileContents) .to .match(/[/][*] An updated comment [*][/]/)
            })
        })

        it('calls the reloadSourceFile callback', () => {
            const methodComment = '/* An updated comment */'

            flow.updateMethodUnformmatedComment({
                methodNewComment: methodComment
            })

            expect(reloadWasCalled) .to .be .true
        })
    })
})