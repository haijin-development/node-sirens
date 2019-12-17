const Classification = require('../../../O').Classification
const ObjectInspectorFlow = require('./ObjectInspectorFlow')
const JsClassInspectorComponent = require('../../components/file-object-inspectors/JsClassInspectorComponent')
const JsClassDocumentationFlow = require('./JsClassDocumentationFlow')
const EditClassCommentDialog = require('../../components/documentation-browser/edition/EditClassCommentDialog')
const EditImplementationNoteDialog = require('../../components/documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/documentation-browser/edition/EditExampleDialog')

class JsClassInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectInspectorFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: {
                object: jsClass,
                showsUnformattedComments: showsUnformattedComments,
                isEditingDocumentation: isEditingDocumentation,
                reloadSourceFile: reloadSourceFile,
            }}) => {

                if( ! jsClass ) {
                    thisFlow.getChildFlow({ id: 'classDocumentation' }).setValue( null )
                    thisFlow.getChildFlow({ id: 'classMethods' }).setChoices( [] )
                    thisFlow.getChildFlow({ id: 'selectedMethod' }).setValue( null )
                    return
                }

                const classDocumentation = jsClass.getDocumentation()
                const methods = jsClass.getMethods()

                thisFlow.getChildFlow({ id: 'classDocumentation' })
                    .setValue({
                        classDocumentation: classDocumentation,
                        isEditingDocumentation: isEditingDocumentation,
                    })

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

            this.object({
                id: 'classDocumentation',
                definedWith: JsClassDocumentationFlow.new({
                    updateClassDocumentationClosure: thisFlow.updateClassDocumentation.bind(thisFlow),
                })
            })
        })

    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.command({
                id: 'getClass',
                whenActioned: thisFlow.getClass.bind(thisFlow),
            })

            this.command({
                id: 'getMethodUnformattedComment',
                whenActioned: thisFlow.getMethodUnformattedComment.bind(thisFlow),
            })

            this.command({
                id: 'isInEditionMode',
                whenActioned: thisFlow.isInEditionMode.bind(thisFlow),
            })

            this.command({
                id: 'showsUnformattedComments',
                whenActioned: thisFlow.showsUnformattedComments.bind(thisFlow),
            })

            this.command({
                id: 'editClassUnformattedComment',
                whenActioned: thisFlow.editClassUnformattedComment.bind(thisFlow),
            })

        })

    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.getClass',
            'flow-commands.getMethodUnformattedComment',
            'flow-commands.isInEditionMode',
            'flow-commands.showsUnformattedComments',
            'flow-commands.editClassUnformattedComment',
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
        return this.getValue().object
    }

    getMethodUnformattedComment() {
        return this.getClass().getClassComment().getContents()
    }

    editClassUnformattedComment({ parentWindow: parentWindow }) {
        const jsClass = this.getClass()

        const className = jsClass.getClassName()

        const classComment = jsClass.getClassComment().getContents()

        const dialog = EditClassCommentDialog.new({
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
}

module.exports = Classification.define(JsClassInspectorFlow)
