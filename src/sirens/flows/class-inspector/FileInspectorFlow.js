const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const JsClassInspectorFlow = require('./JsClassInspectorFlow')

class FileInspectorFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })

            this.whenObjectChanges( ({ newValue: sourceFile, oldValue: oldValue }) => {
                const fileSections = this.getChildFlow({ id: 'fileSections' })

                if( ! sourceFile ) {
                    fileSections.setRoots({ items: [] })
                    fileSections.setSelection( null )
                    return
                }

                const jsFile = sourceFile.getFileStructure()

                const roots = [jsFile]
                const selection = [jsFile]

                fileSections.setRoots({ items: roots })
                fileSections.setSelection( selection )
            })

            this.treeChoice({
                id: 'fileSections',
                roots: [],
                getChildrenClosure: function (fileSection) { return fileSection.getChildSections() },
                whenSelectionChanges: function({ newValue: pathToFileSection }) {
                    const fileSection = pathToFileSection[ pathToFileSection.length - 1 ]

                    const newValue = fileSection ? fileSection : null

                    thisFlow.getChildFlow({ id: 'selectedSectionContents' }).setValue( newValue )
                },
            })

            this.object({
                id: 'selectedSectionContents',
                definedWith: JsClassInspectorFlow.new(),
            })

        })
    }

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {
            const methods = [
                'getSourceFile',
            ]

            this.defineCommandMethods({ methodNames: methods })
        })
    }

    /// Querying

    getSourceFile() {
        return this.getValue()
    }

    setSourceFile({ sourceFile: sourceFile }) {
        return this.setValue( sourceFile )
    }
}

module.exports = Classification.define(FileInspectorFlow)
