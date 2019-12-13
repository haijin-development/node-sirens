const Classification = require('../../../O').Classification

class ClassDefinitionCommands {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }


    flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow }) {

        this.previousClassificationDo( () => {
            this.flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow })
        })

        flowBuilder.commandsGroup({ id: 'class-definition-commands' }, function() {

            this.command({
                id: 'updateClassUnformattedComment',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateClassUnformattedComment.bind(thisFlow),
            })

            this.command({
                id: 'updateClassDocumentationComment',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateClassDocumentationComment.bind(thisFlow),
            })

            this.command({
                id: 'addClassDocumentationImplementationNote',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.addClassDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'updateClassDocumentationImplementationNote',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateClassDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'deleteClassDocumentationImplementationNote',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.deleteClassDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'addClassDocumentationExample',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.addClassDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'updateClassDocumentationExample',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateClassDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'deleteClassDocumentationExample',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.deleteClassDocumentationExample.bind(thisFlow),
            })
        })
    }

    updateClassUnformattedComment({ newClassDescription: newClassDescription }) {
        const classDefinition = this.getBrowsedClass()

        const classComment = classDefinition.getClassComment()

        classComment.writeContents({ contents: newClassDescription })

        this.reloadClassDefinition()
    }

    updateClassDocumentationComment({ newClassDescription: newClassDescription }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.setDescription( newClassDescription )

        this.updateClassDocumentation({ documentation: documentation })
    }

    addClassDocumentationImplementationNote({ implementationNoteText: implementationNoteText }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.addImplementationNote( implementationNoteText )

        this.updateClassDocumentation({ documentation: documentation })
    }

    updateClassDocumentationImplementationNote({ atIndex: index, implementationNoteText: implementationNoteText }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.updateImplementationNoteAt({
            index: index,
            implementationNoteText: implementationNoteText,
        })

        this.updateClassDocumentation({ documentation: documentation })
    }

    deleteClassDocumentationImplementationNote({ atIndex: index }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.deleteImplementationNoteAt({ index: index })

        this.updateClassDocumentation({ documentation: documentation })
    }

    addClassDocumentationExample({ example: example }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.addExample( example )

        this.updateClassDocumentation({ documentation: documentation })
     }

    updateClassDocumentationExample({ atIndex: index, example: example }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.updateExampleAt({ index: index, example: example })

        this.updateClassDocumentation({ documentation: documentation })
    }

    deleteClassDocumentationExample({ atIndex: index }) {
        const documentation = this.getChildFlow({ id: 'classDocumentation' }).getValue()

        documentation.deleteExampleAt({ index: index })

        this.updateClassDocumentation({ documentation: documentation })
    }
}

module.exports = Classification.define(ClassDefinitionCommands)