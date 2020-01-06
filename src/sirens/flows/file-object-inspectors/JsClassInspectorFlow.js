const Classification = require('../../../O').Classification
const ObjectInspectorFlow = require('./ObjectInspectorFlow')
const JsClassInspectorComponent = require('../../components/file-object-inspectors/JsClassInspectorComponent')
const JsClassDocumentationFlow = require('./JsClassDocumentationFlow')

class JsClassInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
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
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Methods

    getFlowComponent() {
        return JsClassInspectorComponent.new({
            model: this.asFlowPoint(),
        })
    }

    getClass() {
        return this.getValue()
    }

    getMethodUnformattedComment() {
        return this.getClass().getClassComment().getContents()
    }

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

        jsClass.getClassComment().writeContents({
            contents: classComment
        })

        this.reloadSourceFile()
    }

    updateClassDocumentation({ classDocumentation: classDocumentation }) {
        const classCommentContents = classDocumentation.generateCommentContents()

        const jsClass = this.getClass()

        const classComment = jsClass.getClassComment()

        const classIndentation = jsClass.getContentsIndentation()

        classComment.writeFormattedContents({
            commentContents: classCommentContents,
            outerIndentation: classIndentation,
        })

        this.reloadSourceFile()
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
