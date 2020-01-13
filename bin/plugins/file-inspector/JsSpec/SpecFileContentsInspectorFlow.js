const Classification = require('../../../../src/O').Classification
const ObjectInspectorFlow = require('../../../../src/sirens/flows/file-object-inspectors/ObjectInspectorFlow')
const SpecContentComponent = require('./SpecContentComponent')

/*
    Class(`
        This flows models an application to browse a JsSpecFile.
        It can be embeded in another application flow wanting to browse JsSpecFiles.
    `)
*/
class SpecFileContentsInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
    }

    /// Building

    /*
        Method(`
            Builds the main flow, its children, its commands and its namespaces.
        `)
    */
    buildWith(flow) {

        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'saveSelectedSpec',
                    'setSelectedSpecIndex',
                ],
            })

            this.whenObjectChanges( ({ newValue: specFile }) => {
                const fileObjects = specFile ?
                    specFile.getChildObjects()
                    :
                    []

                const specObjectsOnly = thisFlow.selectSpecObjectsOnlyFrom({
                    fileObjects: fileObjects
                })

                thisFlow.setSpecObjectsRoots({ specObjects: specObjectsOnly })
            })

            this.treeChoice({
                id: 'specObjects',
                roots: [],
                getChildrenClosure: function (specObject) {
                    return thisFlow.selectSpecObjectsOnlyFrom({
                        fileObjects: specObject.getChildObjects()
                    })
                },
                whenSelectionChanges: function({ newValue: specOrDescriptionObjectTreePath }) {
                    const selection =
                        specOrDescriptionObjectTreePath[ specOrDescriptionObjectTreePath.length - 1 ]

                    const selectedSpec = selection && selection.respondsTo('isJsSpecObject') ?
                            selection
                            :
                            null

                    thisFlow.setSelectedSpecFullDescription({ specObjectPath: specOrDescriptionObjectTreePath })

                    thisFlow.setSelectedSpecContents({ specObject: selectedSpec })
                },
            })

            this.value({ id: 'selectedSpecFullDescription' })

            this.value({ id: 'selectedSpecContents' })
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'saveSelectedSpec',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /*
        Method(`
            Returns a Component object to browse this flow.
        `)
    */
    getFlowComponent() {
        return SpecContentComponent.new({
            model: this.asFlowPoint(),
        })
    }

    /*
        Methods(`
            Sets the given specObjects as the roots of the tree of spec objects.
        `)
    */
    setSpecObjectsRoots({ specObjects: specObjects }) {
        this.getChildFlow({ id: 'specObjects' })
            .setRoots({ items: specObjects })
    }

    /*
        Method(`
            Returns the object in the given fileObjects array that are JsSpecObjects.

            A JsSpecFile may have other objects like TextualContent.
        `)
    */
    selectSpecObjectsOnlyFrom({ fileObjects: fileObjects }) {
        return fileObjects.filter( (jsObject) => {
            return jsObject.respondsTo('isJsSpecObject')
        })
    }

    setSelectedSpecFullDescription({ specObjectPath: specObjectPath }) {
        let fullDescriptionParts = specObjectPath.map( (each) => {
            return each.getDisplayString()
        })

        const fullDescription = fullDescriptionParts.join(' ')

        const selectedSpecFullDescription = this.getChildFlow({ id: 'selectedSpecFullDescription' })

        selectedSpecFullDescription.setValue( fullDescription )
    }

    /*
        Method(`
            Sets the displayable contents of the spec object selected in the tree.
        `)
    */
    setSelectedSpecContents({ specObject: selectedSpec }) {
        const selectedSpecContents = this.getChildFlow({ id: 'selectedSpecContents' })

        const contents = selectedSpec ?
            selectedSpec.getFormattedSourceCode()
            :
            ''

        selectedSpecContents.setValue( contents )
    }


    /*
        Method(`
            Returns the current selection in the spec objects tree.
        `)
    */
    getSelectedSpec() {
        return this.getChildFlow({ id: 'specObjects' })
            .getSelectionValue()
    }

    /*
        Method(`
            Returns the index of the selected JsSpecTest in the tree of methods
            of the class.

            This index is used to restore the same method after a reload of the
            source code.
        `)
    */
    getSelectedSpecIndex() {
        return this.getChildFlow({ id: 'specObjects' })
            .getSelectionIndexPath()
    }

    setSelectedSpecIndex({ indices: indices }) {
        this.getChildFlow({ id: 'specObjects' })
            .setSelectionIndexPath({ indexPath: indices })
    }

    /*
        Method(`
            Writes the contents of the selected spec edition to the specs file.
        `)
    */
    saveSelectedSpec() {
        const jsSpec = this.getSelectedSpec()

        const editedSpecSourceCode =
            this.getChildFlow({ id: 'selectedSpecContents' }).getValue()

        jsSpec.writeContents({ specContents: editedSpecSourceCode })

        const selectionIndices = this.getSelectedSpecIndex()

        this.reloadSourceFile({
            thenDo: function(mainFlow) {
                mainFlow.executeCommand({
                    id: 'setSelectedSpecIndex',
                    with: { indices: selectionIndices },
                })
            }
        })
     }
}

module.exports = Classification.define(SpecFileContentsInspectorFlow)
