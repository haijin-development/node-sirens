const Classification = require('../O').Classification
const NamespaceFlow = require('./flows/NamespaceFlow')

const ValueModel = require('./models/ValueModel')
const ChoiceModel = require('./models/ChoiceModel')
const TreeChoiceModel = require('./models/TreeChoiceModel')

class FingerTipsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'FingerTipsNamespace' }, function(thisFlow) {
            this.defineMethodsAsCreateObjectCommands({
                methods: [
                    'ValueModel',
                    'TreeChoiceModel',
                    'ChoiceModel',
                ],
            })
        })
    }

    ValueModel({ value: value } = { value: null }) {
        return ValueModel.new({ value: value })
    }

    TreeChoiceModel({ selectionModel: selectionModel, roots: roots, getChildrenClosure: getChildrenClosure }) {
        return TreeChoiceModel.new({
            selectionModel: selectionModel,
            roots: roots,
            getChildrenClosure: getChildrenClosure,
        })
    }

    ChoiceModel({ choices: choices, selection: selection } = { choices: [], selection: null }) {
        return ChoiceModel.new({
            choices: choices,
            selection: selection
        })
    }
}

module.exports = Classification.define(FingerTipsNamespace)
