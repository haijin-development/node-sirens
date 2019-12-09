const Sirens = require('../../../Sirens')

function classDefinitionCommands(thisFlow) {
    this.category( 'class definition commands', () => {

        this.command({
            id: 'updateClassUnformattedComment',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ newClassDescription: newClassDescription }) {
                const classDefinition = thisFlow.getBrowsedClass()
                const classComment = classDefinition.getClassComment()
                classComment.writeContents({ contents: newClassDescription })
                thisFlow.reloadClassDefinition()
            }
        })

        this.command({
            id: 'updateClassDocumentationComment',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ newClassDescription: newClassDescription }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.setDescription( newClassDescription )
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'addClassDocumentationImplementationNote',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ implementationNoteText: implementationNoteText }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.addImplementationNote( implementationNoteText )
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'updateClassDocumentationImplementationNote',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index, implementationNoteText: implementationNoteText }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.updateImplementationNoteAt({
                    index: index,
                    implementationNoteText: implementationNoteText,
                })
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteClassDocumentationImplementationNote',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.deleteImplementationNoteAt({ index: index })
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'addClassDocumentationExample',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ example: example }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.addExample( example )
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'updateClassDocumentationExample',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index, example: example }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.updateExampleAt({ index: index, example: example })
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteClassDocumentationExample',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index }) {
                const documentation = thisFlow.getChildFlow({ id: 'classDocumentation' }).getValue()
                documentation.deleteExampleAt({ index: index })
                thisFlow.updateClassDocumentation({ documentation: documentation })
            }
        })

    })

}


module.exports = {
    classDefinitionCommands: classDefinitionCommands,
}