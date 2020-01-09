const Classification = require('../../../O').Classification
const Protocol = require('../../../O').Protocol
const ObjectInspectorFlow = require('./ObjectInspectorFlow')
const JsClassInspectorComponent = require('../../components/file-object-inspectors/JsClassInspectorComponent')
const JsClassDocumentationFlow = require('./JsClassDocumentationFlow')


class JsClassInspectorFlowMethodAssertions {
    getFlowComponent({ parentWindow: parentWindow }) {
        this.param( parentWindow ) .isNotNull() .isNotUndefined()        
    }
}
JsClassInspectorFlowMethodAssertions = Protocol.define(JsClassInspectorFlowMethodAssertions)



class JsClassInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
        this.implements = [JsClassInspectorFlowMethodAssertions]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'getClass',
                    'getMethodUnformattedComment',
                    'getAllMethodsTagLabels',
                    'isInEditionMode',
                    'showsUnformattedComments',
                    'editClassUnformattedComment',
                    'setIsBrowsingDocumentation',
                    'isBrowsingDocumentation',
                    'saveSelectedMethod',
                    'setMethodSelectionIndex',
                ],
            })

            this.acceptedBubbledUps({
                commands: [
                    'updateClassDocumentation',
                ]
            })

            this.whenObjectChanges( ({ newValue: jsClass }) => {

                if( ! jsClass ) {
                    thisFlow.getChildFlow({ id: 'classDocumentation' }).setValue( null )
                    thisFlow.getChildFlow({ id: 'classMethods' }).setChoices( [] )
                    thisFlow.getChildFlow({ id: 'selectedMethod' }).setValue( null )
                    return
                }

                const classDocumentation = thisFlow.getDocumentationOf({ jsClass: jsClass })
                const methods = jsClass.getMethods()

                thisFlow.getChildFlow({ id: 'classDocumentation' })
                    .setValue( classDocumentation )

                thisFlow.getChildFlow({ id: 'classMethods' })
                    .setChoices( methods )

                thisFlow.getChildFlow({ id: 'classMethods.selectedMethod' })
                    .setValue( null )
             })

            this.choice({
                id: 'classMethods',
                choices: [],
                whenSelectionChanges: ({ newValue: methodDefinition }) => {
                    const selectedMethod = thisFlow.getChildFlow({ id: 'selectedMethod' })

                    if( ! methodDefinition ) {
                        selectedMethod.setValue('')
                    } else {
                        selectedMethod.setValue( methodDefinition.getFormattedSourceCode() )
                    }
                },
            }, function() {

                this.value({ id: 'selectedMethod' })

            })

            this.value({
                id: 'selectedTags',
                value: [],
                whenValueChanges: ({ newValue: tags }) => {
                    const filteredMethods =
                        thisFlow.getMethodsFilteredByTags({ tagsFilter: tags })

                    thisFlow.getChildFlow({ id: 'classMethods' })
                        .setChoices(filteredMethods)
                },
            })

            this.object({
                id: 'classDocumentation',
                definedWith: JsClassDocumentationFlow.new()
            })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'getClass',
            'getMethodUnformattedComment',
            'getAllMethodsTagLabels',
            'isInEditionMode',
            'showsUnformattedComments',
            'editClassUnformattedComment',
            'setIsBrowsingDocumentation',
            'isBrowsingDocumentation',
            'saveSelectedMethod',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Methods

    getFlowComponent({ parentWindow: parentWindow }) {
        return JsClassInspectorComponent.new({
            model: this.asFlowPoint(),
            window: parentWindow,
        })
    }

    getClass() {
        return this.getValue()
    }

    getMethodUnformattedComment() {
        return this.getClass().getClassComment().getContents()
    }

    getAllMethodsTagLabels() {
        const jsClass = this.getClass()

        const allLabelsSet = new Set()

        const allMethodsDefinition = jsClass.getMethods()

        allMethodsDefinition.forEach( (jsMethod) => {
            const methodTags = this.getMethodDocumentationOf({ jsMethod: jsMethod })
                .getTags()

            methodTags.forEach( (documentationTag) => {
                const tagLabel = documentationTag.getLabel()

                allLabelsSet.add( tagLabel )
            })
        })

        const allMethodsTagLabels = allLabelsSet.values()

        return Array.from( allMethodsTagLabels )
    }

    getMethodsFilteredByTags({ tagsFilter: tagsFilter }) {
        const jsClass = this.getClass()

        const methods = jsClass.getMethods()

        if( tagsFilter.length === 0 ) { return methods }

        const methodsWithSelectedTags = []

        methods.forEach( (jsMethod) => {
            const methodTags = his.getMethodDocumentationOf({ jsMethod: jsMethod })
                .getTagLabels()

            const includeMethod = tagsFilter.every( (eachTagFilter) => {
                return methodTags.includes( eachTagFilter )
            })

            if( includeMethod === true ) {
                methodsWithSelectedTags.push( jsMethod )
            }
        })

        return methodsWithSelectedTags
    }

    /*
        Method(`
            Returns the selected JsMethod of null if no method is selected.
        `)
    */
    getSelectedMethod() {
        return this.getChildFlow({ id: 'classMethods' }).getSelection()
    }

    /*
        Method(`
            Returns the index of the selected JsMethod in the list of methods
            of the class.

            This index is used to restore the same method after a reload of the
            source code.
        `)
    */
    getSelectedMethodIndex() {
        return this.getChildFlow({ id: 'classMethods' }).getSelectionIndex()
    }

    setMethodSelectionIndex({ index: index }) {
        this.getChildFlow({ id: 'classMethods' }).setSelectionIndex({ index: index })
    }

    /*
        Method(`
            Returns the edited contents of the selected method.
        `)
    */
    getSelectedMethodEditedSourceCode() {
        return this.getChildFlow({ id: 'selectedMethod' }).getValue()
    }

    // Actions

    editClassUnformattedComment({ parentWindow: parentWindow }) {
        const jsClass = this.getClass()

        const className = jsClass.getClassName()

        const classComment = jsClass.getClassComment().getContents()

        const dialog = this.guiNamespace().EditClassCommentDialog.new({
            className: className,
            classComment: classComment,
            window: parentWindow,
            onUpdateClassComment: ({ classNewComment: classNewComment }) => {
                this.updateClassUnformattedComment({
                    classNewComment: classNewComment
                })   
            },
        })

        dialog.open()
    }

    updateClassUnformattedComment({ classNewComment: classComment }) {
        const jsClass = this.getClass()

        jsClass.getClassComment().writePlainContents({
            contents: classComment
        })

        this.reloadSourceFile()
    }

    updateClassDocumentation({ classDocumentation: classDocumentation }) {
        const classCommentContents = classDocumentation.generateCommentContents()

        const jsClass = this.getClass()

        const classComment = jsClass.getClassComment()

        const classIndentation = jsClass.getContentsIndentation()

        classComment.writeContents({
            commentContents: classCommentContents,
            outerIndentation: classIndentation,
        })

        this.reloadSourceFile()
    }

    /*
        Method(`
            Writes the contents of the selected method edition to the method file.
        `)
    */
    saveSelectedMethod() {
        const jsMethod = this.getSelectedMethod()
        const editedMethodSourceCode = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        jsMethod.writeContents({ methodContents: editedMethodSourceCode })

        const selectionIndex = this.getSelectedMethodIndex()

        this.reloadSourceFile({
            thenDo: function(mainFlow) {
                mainFlow.executeCommand({
                    id: 'setMethodSelectionIndex',
                    with: { index: selectionIndex },
                })
            }
        })
     }

    // Namespaces

    /*
        Method(`
            Returns the namespace where are defined the classes specific to the
            GUI.
        `)
    */
    guiNamespace() {
        return this.bubbleUp({
            command: 'guiNamespace',
        })
    }

    getDocumentationOf({ jsClass: jsClass }) {
        return this.mainNamespace().DocumentationReader.new()
            .readClassDocumentationFrom({ jsClass: jsClass })
    }

    getMethodDocumentationOf({ jsMethod: jsMethod }) {
        return this.mainNamespace().DocumentationReader.new()
            .readMethodDocumentationFrom({ jsMethod: jsMethod })
    }
}

module.exports = Classification.define(JsClassInspectorFlow)
