const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const Sirens = require('../../../Sirens')

class FileInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: fileObject }) => {
                if( ! fileObject ) {
                    thisFlow.getChildFlow({ id: 'classMethods' }).setChoices( [] )
                    thisFlow.getChildFlow({ id: 'selectedMethod' }).setValue( '' )
                    return
                }

                let methods
                let selectedMethodContents

                if( thisFlow.hasAClassSelected() ) {
                    methods = fileObject.getMethods()
                }

                if( ! methods ) { methods = [] }
                if( ! selectedMethodContents ) { selectedMethodContents = '' }

                this.getChildFlow({ id: 'classMethods' }).setChoices( methods )

                thisFlow.getChildFlow({ id: 'selectedMethod' }).setValue( selectedMethodContents )
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
            })

            this.value({ id: 'selectedMethod' })
        })

    }

    flowCommands(thisFlow) {
        this.category( 'flow commands', () => {

            this.command({
                id: 'openClassDocumentation',
                enabledIf: function() {
                    return thisFlow.hasAClassSelected()
                },
                whenActioned: function() {
                    const jsClass = thisFlow.getValue()
                    const methodName = thisFlow.getSelectedMethodName()
                    Sirens.browseClassDocumentation({ jsClass: jsClass, methodName: methodName })
                }
            })

        })

    }

    hasAClassSelected() {
        const jsSection = this.getValue()

        return jsSection && jsSection.respondsTo('isJsClass')
    }

    getSelectedClassDefinition() {
        if( ! this.hasAClassSelected() ) { return null }

        const fileObject = this.getValue()

        return fileObject
    }

    getSelectedMethodName() {
        const selectedMethod = this.getChildFlow({ id: 'classMethods' }).getSelection()

        if( ! selectedMethod ) { return null }

        return selectedMethod.getMethodName()
    }
}

module.exports = Classification.define(FileInspectorFlow)
