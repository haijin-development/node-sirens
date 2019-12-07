const path = require('path')
const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const PlugabbleDisplayable = require('../../objects/PlugabbleDisplayable')

class FileClassesEditionFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'sourceFileEdition' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })

            this.whenObjectChanges( ({ newValue: sourceFile, oldValue: oldValue }) => {
                const jsFile = sourceFile.getFileStructure()

                const roots = [jsFile]
                const selection = [jsFile]

                this.getChildFlow({ id: 'fileSections' }).setRoots({ items: roots })
                this.getChildFlow({ id: 'fileSections' }).setSelection( selection )
            })

            this.treeChoice({
                id: 'fileSections',
                roots: [],
                getChildrenClosure: function (fileSection) { return fileSection.getChildSections() },
                whenSelectionChanges: function({ newValue: pathToFileSection }) {
                    const fileSection = pathToFileSection[ pathToFileSection.length - 1 ]

                    thisFlow.getChildFlow({ id: 'selectedSectionContents' }).setValue( fileSection )
                },
            })

            this.value({ id: 'selectedSectionContents' }, function(selectedSectionContents) {

                this.whenObjectChanges( ({ newValue: fileSection }) => {
                    let methods
                    let editedContents

                    if( thisFlow.isJsClass({ fileSection: fileSection }) ) {
                        methods = fileSection.getMethods()
                    }

                    if( thisFlow.isTextualContent({ fileSection: fileSection }) ) {
                        editedContents = fileSection.getContents()
                    }

                    if( methods === undefined ) { methods = [] }
                    if( editedContents === undefined ) { editedContents = '' }

                    selectedSectionContents.getChildFlow({ id: 'classMethods' }).setChoices( methods )

                    selectedSectionContents.getChildFlow({ id: 'editedContents' }).setValue( editedContents )
                 })

                this.choice({
                    id: 'classMethods',
                    choices: [],
                    whenSelectionChanges: ({ newValue: methodDefinition }) => {
                        const editedContents = selectedSectionContents.getChildFlow({ id: 'editedContents' })

                        if( methodDefinition === null ) {
                            editedContents.setValue('')
                        } else {
                            editedContents.setValue( methodDefinition.getFormattedSourceCode() )
                        }
                    },
                })

                this.value({ id: 'editedContents' })
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

    isJsClass({ fileSection: fileSection }) {
        return fileSection && fileSection.respondsTo('isJsClass')
    }

    isTextualContent({ fileSection: fileSection }) {
        return fileSection && fileSection.respondsTo('isTextualContent')        
    }

    getSelectedClassDefinition() {
        const fileSection = this.getChildFlow({ id: 'selectedSectionContents' }).getValue()

        if( ! this.isJsClass({ fileSection: fileSection }) ) { return null }

        return fileSection
    }

    getSelectedMethodName() {
        const selectedMethod = this.getChildFlow({ id: 'classMethods' }).getSelection()

        if( ! selectedMethod ) { return null }

        return selectedMethod.getMethodName()
    }
}

module.exports = Classification.define(FileClassesEditionFlow)
