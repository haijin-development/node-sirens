const path = require('path')
const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const PlugabbleDisplayable = require('../../objects/PlugabbleDisplayable')

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

            this.value({ id: 'selectedSectionContents' }, function(selectedSectionContents) {

                this.whenObjectChanges( ({ newValue: fileSection }) => {
                    if( ! fileSection ) {
                        selectedSectionContents.getChildFlow({ id: 'classMethods' }).setChoices( [] )
                        selectedSectionContents.getChildFlow({ id: 'selectedMethod' }).setValue( '' )
                        return
                    }

                    let methods
                    let selectedMethodContents

                    if( thisFlow.isJsClass({ fileSection: fileSection }) ) {
                        methods = fileSection.getMethods()
                    }

                    if( thisFlow.isTextualContent({ fileSection: fileSection }) ) {
                        selectedMethodContents = fileSection.getContents()
                    }

                    if( ! methods ) { methods = [] }
                    if( ! selectedMethodContents ) { selectedMethodContents = '' }

                    selectedSectionContents.getChildFlow({ id: 'classMethods' }).setChoices( methods )

                    selectedSectionContents.getChildFlow({ id: 'selectedMethod' }).setValue( selectedMethodContents )
                 })

                this.choice({
                    id: 'classMethods',
                    choices: [],
                    whenSelectionChanges: ({ newValue: methodDefinition }) => {
                        const selectedMethod = selectedSectionContents.getChildFlow({ id: 'selectedMethod' })

                        if( ! methodDefinition ) {
                            selectedMethod.setValue('')
                        } else {
                            selectedMethod.setValue( methodDefinition.getFormattedSourceCode() )
                        }
                    },
                })

                this.value({ id: 'selectedMethod' })
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

module.exports = Classification.define(FileInspectorFlow)
