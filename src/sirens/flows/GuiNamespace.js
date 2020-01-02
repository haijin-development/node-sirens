const Classification = require('../../O').Classification
const NamespaceFlow = require('../../finger-tips/flows/NamespaceFlow')

const EditClassDescriptionDialog = require('../components/documentation-browser/edition/EditClassDescriptionDialog')
const EditClassCommentDialog = require('../components/documentation-browser/edition/EditClassCommentDialog')
const EditTagsDialog = require ('../components/documentation-browser/edition/EditTagsDialog')
const EditMethodDescriptionDialog = require('../components/documentation-browser/edition/EditMethodDescriptionDialog')
const EditParamDialog = require ('../components/documentation-browser/edition/EditParamDialog')
const EditReturnValueDialog = require('../components/documentation-browser/edition/EditReturnValueDialog')
const EditImplementationNoteDialog = require('../components/documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../components/documentation-browser/edition/EditExampleDialog')

const EditMethodCommentDialog = require('../components/documentation-browser/edition/EditMethodCommentDialog')

class GuiNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = ['skinsNamespace']
        this.assumes = [NamespaceFlow]
    }

    initialize({ id: id, idPath: idPath, skinsNamespace: skinsNamespace }) {
        this.skinsNamespace = skinsNamespace

        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'GuiNamespace' }, function(thisFlow) {

            const skinsNamespace = thisFlow.getSkinsNamespace()

            this.defineMethodsAsCreateObjectCommands({
                methods: [
                    'EditClassDescriptionDialog',
                    'EditClassCommentDialog',
                    'EditTagsDialog',
                    'EditMethodDescriptionDialog',
                    'EditParamDialog',
                    'EditReturnValueDialog',
                    'EditImplementationNoteDialog',
                    'EditExampleDialog',
                    'EditMethodCommentDialog',
                ],
                inNamespace: skinsNamespace,
            })
        })
    }

    getSkinsNamespace() {
        return this.skinsNamespace
    }


    EditClassDescriptionDialog(props) {
        return EditClassDescriptionDialog.new(props)
    }

    EditClassCommentDialog(props) {
        return EditClassCommentDialog.new(props)
    }

    EditTagsDialog(props) {
        return EditTagsDialog.new(props)
    }

    EditMethodDescriptionDialog(props) {
        return EditMethodDescriptionDialog.new(props)
    }

    EditParamDialog(props) {
        return EditParamDialog.new(props)
    }

    EditReturnValueDialog(props) {
        return EditReturnValueDialog.new(props)
    }

    EditImplementationNoteDialog(props) {
        return EditImplementationNoteDialog.new(props)
    }

    EditExampleDialog(props) {
        return EditExampleDialog.new(props)
    }

    EditMethodCommentDialog(props) {
        return EditMethodCommentDialog.new(props)
    }
}

module.exports = Classification.define(GuiNamespace)
