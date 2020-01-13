const expect = require('chai').expect
const fileSamplesRepository = require('../fileSamplesRepository')
const namespace = require('../sirensNamespace')

describe('When using an FileInspectorFlow', () => {
    const fileSample = __dirname + '/../../../samples/class-definition.js'

    let filePath
    let sourceFile
    let flow

    beforeEach( () => {
        fileSamplesRepository.cleanUp()
        fileSamplesRepository.manageFile({ file: fileSample })

        filePath = fileSamplesRepository.pathTo( fileSample )
        sourceFile = namespace.SourceFile.new({ path: filePath  })

        flow = namespace.FileInspectorFlow.new()
        flow.setCommandsController( namespace.ApplicationCommandsController.new({ mainFlow: flow }) )

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
            'main.fileObjects',

            'main.selectedFileObject',
            'main.selectedFileObject.text',
            'main.selectedFileObject.getText',

            'main.getFileObjectComponent',
            'main.getSelectedFileObject',
            'main.getFileObjectInspectorFlow',
            'main.getSourceFile',

        ])
    })

    describe('when setting a SourceFile', () => {
        beforeEach( () => {
            flow.setSourceFile({ sourceFile: sourceFile })
        })

        it('sets the SourceFile to the main flow', () => {
            expect(flow) .withId( 'main' ) .withValue .suchThat( (sourceFile) => {
                expect( sourceFile.getPath() ) .to
                    .match(/^.*tmp-files-repository[/]class-definition[.]js$/)
            })
        })

        it('sets the SourceFile sections to the fileObjects flow', () => {
            expect(flow) .withId( 'main.fileObjects' ) .withRoots .eachSuchThat( (root) => {
                expect(root) .to .behaveAs( 'JsFileObject' )
            })
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .withSelection .suchThat( (selection) =>{
                expect(selection) .count .to .equal( 1 )
                expect(selection[0]) .to .behaveAs( 'JsFileObject' )
            })
        })

        it('sets the selectedFileObject to the first fileObject', () => {
            expect(flow) .withId( 'main.selectedFileObject' ) .withValue .suchThat( (jsFile) => {
                expect( jsFile ) .to .behaveAs( 'JsFileObject' )
            })
        })

    })

    describe('when setting a null SourceFile', () => {
        beforeEach( () => {
            flow.setSourceFile({ sourceFile: sourceFile })
            flow.setSourceFile({ sourceFile: null })
        })

        it('sets the SourceFile to the main flow', () => {
            expect(flow) .withId( 'main' ) .withValue .suchThat( (sourceFile) => {
                expect(sourceFile) .to .be .null
            })
        })

        it('sets the SourceFile sections to the fileObjects flow', () => {
            expect(flow) .withId( 'main.fileObjects' ) .to .haveRoots( [] )
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .withSelection .suchThat( (selection) => {
                expect(selection) .to .eql( [] )
            })
        })

        it('sets the selectedFileObject to the first fileObject', () => {
            expect(flow) .withId( 'main.selectedFileObject' ) .to .haveValue( null )
        })

    })


    describe('when selecting a JsClass file object', () => {
        beforeEach( () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            const jsFile = getChildFromRoots({ indexPath: [0] })
            const jsClass = getChildFromRoots({ indexPath: [0, 1] })

            flow.getChildFlow({ id: 'fileObjects' }).setSelection([ jsFile, jsClass ])
        })

        it('sets the selected jsClass to the fileObjects selection', () => {
            const jsFile = getChildFromRoots({ indexPath: [0] })
            const jsClass = getChildFromRoots({ indexPath: [0, 1] })

            expect(flow) .withId( 'main.fileObjects' ) .withSelection .suchThat( (selection) => {
                expect(selection) .to .eql( [ jsFile, jsClass ] )
            })
        })

        it('sets the jsClass to the :selectedFileObject', () => {
            const jsClass = getChildFromRoots({ indexPath: [0, 1] })

            expect(flow) .withId( 'main.selectedFileObject' ) .to .haveValue( jsClass )
        })

        it('sets :selectedFileObject flow to a JsClassInspectorFlow', () => {
            const selectedFileObjectFlow = flow.getChildFlow({ id: 'selectedFileObject' })

            expect(selectedFileObjectFlow) .to .behaveAs( 'JsClassInspectorFlow' )
        })
    })

    describe('when selecting a JsMethod file object', () => {
        beforeEach( () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            const jsFile = getChildFromRoots({ indexPath: [0] })
            const jsClass = getChildFromRoots({ indexPath: [0, 1] })
            const jsMethod = getChildFromRoots({ indexPath: [0, 1, 1] })

            flow.getChildFlow({ id: 'fileObjects' })
                .setSelection([ jsFile, jsClass, jsMethod ])
        })

        it('sets the selected jsMethod to the fileObjects selection', () => {
            const jsFile = getChildFromRoots({ indexPath: [0] })
            const jsClass = getChildFromRoots({ indexPath: [0, 1] })
            const jsMethod = getChildFromRoots({ indexPath: [0, 1, 1] })

            expect(flow) .withId( 'main.fileObjects' ) .withSelection .suchThat( (selection) => {
                expect(selection) .to .eql([ jsFile, jsClass, jsMethod ]) 
            })
        })

        it('sets the jsMethod to the :selectedFileObject', () => {
            const jsMethod = getChildFromRoots({ indexPath: [0, 1, 1] })

            expect(flow) .withId( 'main.selectedFileObject' ) .to .haveValue( jsMethod )
        })

        it('sets :selectedFileObject flow to a JsClassInspectorFlow', () => {
            const selectedFileObjectFlow = flow.getChildFlow({ id: 'selectedFileObject' })

            expect(selectedFileObjectFlow) .to .behaveAs( 'JsMethodInspectorFlow' )
        })

        it('reloads the JsMethod', () => {
            const jsFile = getChildFromRoots({ indexPath: [0] })
            const jsClass = getChildFromRoots({ indexPath: [0, 1] })
            const jsMethod = getChildFromRoots({ indexPath: [0, 1, 1] })

            flow.reloadSourceFile()

            const newJsFile = getChildFromRoots({ indexPath: [0] })
            const newJsClass = getChildFromRoots({ indexPath: [0, 1] })
            const newJsMethod = getChildFromRoots({ indexPath: [0, 1, 1] })

            expect(flow) .withId( 'main.fileObjects' ) .withSelection .suchThat( (selection) => {
                expect(selection) .to .eql([ newJsFile, newJsClass, newJsMethod ]) 
            })

            expect(flow) .withId( 'main.selectedFileObject' ) .withValue .suchThat( (value) => {
                expect( value ) .not .to .eql( jsMethod )
                expect( value ) .to .equal( newJsMethod )
            })
        })
    })

    describe('when selecting a null jsObject in the tree', () => {
        beforeEach( () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            inTreeSelectObjectAtIndex({ indexPath: [0, 1] })
            inTreeSelectObjectAtIndex({ indexPath: [] })
        })

        it('sets the SourceFile sections selection to the first fileObject', () => {
            expect(flow) .withId( 'main.fileObjects' ) .withSelection .suchThat( (selection) => {
                expect(selection) .to .eql( [] )
            })
        })

        it('sets the selectedFileObject to null', () => {
            expect(flow) .withId( 'main.selectedFileObject' ) .to .haveValue( null )
        })

    })

    describe('methods', () => {
        it('.getRootFileObject() returns null if not root is set', () => {
            expect( flow.getRootFileObject() ) .to .be .null
        })

        it('.getRootFileObject() returns the root object', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            const jsFile = getChildFromRoots({ indexPath: [0] })

            expect( flow.getRootFileObject() ) .to .equal(jsFile)
        })
    })    

    describe('commands', () => {
        it('.getSourceFile() returns null if not source is selected', () => {
            expect( flow.asFlowPoint().getSourceFile() ) .to .be .null
        })

        it('.getSourceFile() returns the selected sourceFile', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            expect( flow.asFlowPoint().getSourceFile() ) .to .equal(sourceFile)
        })

        it('.getSelectedFileObject() returns null if not object is selected', () => {
            expect( flow.asFlowPoint().getSelectedFileObject() ) .to .be .null
        })

        it('.getSelectedFileObject() returns the selected object', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            inTreeSelectObjectAtIndex({ indexPath: [0, 1] })

            const jsClass = getChildFromRoots({ indexPath: [0, 1] })

            expect( flow.asFlowPoint().getSelectedFileObject() ) .to .equal( jsClass )
        })

        it('.getFileObjectInspectorFlow() returns a TextualContentInspectorFlow by default', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            const jsObject = flow.getRootFileObject()

            const objectInspectorFlow = flow.asFlowPoint()
                .getFileObjectInspectorFlow({ fileObject: jsObject })

            expect( objectInspectorFlow ) .to
                .behaveAs( 'TextualContentInspectorFlow' )
        })

        it('.getFileObjectInspectorFlow() returns a JsClassInspectorFlow for a JsClass', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            const jsClass = flow.getRootFileObject()
                .getChildObjectAt({ index: 1 })

            const objectInspectorFlow = flow.asFlowPoint()
                .getFileObjectInspectorFlow({ fileObject: jsClass })

            expect( objectInspectorFlow ) .to
                .behaveAs( 'JsClassInspectorFlow' )
        })

        it('.getFileObjectInspectorFlow() returns a JsMethodInspectorFlow for a JsMethod', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            const jsMethod = flow.getRootFileObject()
                .getChildObjectAt({ index: 1 })
                .getChildObjectAt({ index: 1 })

            const objectInspectorFlow = flow.asFlowPoint()
                .getFileObjectInspectorFlow({ fileObject: jsMethod })

            expect( objectInspectorFlow ) .to .behaveAs( 'JsMethodInspectorFlow' )
        })

        it('.getFileObjectComponent() returns a TextualContentComponent by default', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            inTreeSelectObjectAtIndex({ indexPath: [0] })

            expect( flow.getFileObjectComponent({ parentWindow: '' }) ) .to .behaveAs( 'TextualContentComponent' )
        })

        it('.getFileObjectComponent() returns a JsClassInspectorComponent for a JsClass', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            inTreeSelectObjectAtIndex({ indexPath: [0, 1] })

            expect( flow.getFileObjectComponent({ parentWindow: '' }) ) .to .behaveAs( 'JsClassInspectorComponent' )
        })

        it('.getFileObjectComponent() returns a JsMethodInspectorComponent for a JsMethod', () => {
            flow.setSourceFile({ sourceFile: sourceFile })

            inTreeSelectObjectAtIndex({ indexPath: [0, 1, 1] })

            expect( flow.getFileObjectComponent({ parentWindow: '' }) ) .to .behaveAs( 'JsMethodInspectorComponent' )
        })

        it('.setShowUnformattedComments() set the edition mode', () => {
            flow.setShowUnformattedComments({ value: true })
        })

        it('.setIsEditingDocumentation() set the edition mode', () => {
            flow.setIsEditingDocumentation({ value: true })
        })

    })

    function inTreeSelectObjectAtIndex({ indexPath: indexPath }) {
        const selectionPath = []

        const jsFile = flow.getRootFileObject()

        let nodes = [jsFile]

        indexPath.forEach( (i) => {
            const currentNode = nodes[i]

            selectionPath.push( currentNode )

            nodes = currentNode.getChildObjects()
        })

        flow.setSelectedFileObject({ pathToObject: selectionPath })
    }

    function getChildFromRoots({ indexPath: indexPath }) {
        let object = null

        const jsFile = flow.getRootFileObject()

        let nodes = [jsFile]

        indexPath.forEach( (i) => {
            object = nodes[i]

            nodes = object.getChildObjects()
        })

        return object
    }
})