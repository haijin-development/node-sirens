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
        flow.main({ id: 'sourceFileEdition' }, function(fileContents) {

            this.defineFlowCommandsIn({ method: fileContents.flowMethods })

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                this.getChildFlow({ id: 'fileSections' }).setChoices( fileContents.getSectionsDefinedInOpenedFile() )
                this.getChildFlow({ id: 'fileSections' }).setSelectionIndex({ index: 0 })
            })

            this.choice({
                id: 'fileSections',
                choices: [],
                whenSelectionChanges: ({ newValue: fileSection }) => {
                    fileContents.getChildFlow({ id: 'selectedSectionContents' }).setValue( fileSection )
                },
            })

            this.value({ id: 'selectedSectionContents' }, function(selectedSectionContents) {

                this.whenObjectChanges( ({ newValue: fileSection }) => {
                    let methods
                    let editedContents

                    if( fileContents.isHeader({ fileSection: fileSection }) ) {
                        editedContents = fileSection.getSourceCode()
                    }

                    if( fileContents.isClassDefinition({ fileSection: fileSection }) ) {
                        methods = fileSection.getMethods()
                    }

                    if( fileContents.isFooter({ fileSection: fileSection }) ) {
                        editedContents = fileSection.getSourceCode()
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
                            editedContents.setValue( methodDefinition.getFunctionFormattedSourceCode() )
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
                'getSectionsDefinedInOpenedFile',
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

    getSectionsDefinedInOpenedFile() {
        const sourceFile = this.getSourceFile()

        if( ! sourceFile ) { return [] }

        const sections = []

        sourceFile.getClasses().forEach( (classDefinition) => {

            const header = classDefinition.getHeader()

            header.behaveAs( PlugabbleDisplayable )
            header.setDisplayText({ text: classDefinition.getClassName() + ' Header' })

            sections.push( header )

            classDefinition.behaveAs( PlugabbleDisplayable )
            classDefinition.setDisplayText({ text: classDefinition.getClassName()  })

            sections.push( classDefinition )
        })

        const footer = sourceFile.getFooter()
        footer.behaveAs( PlugabbleDisplayable )
        footer.setDisplayText({ text: 'File Footer' })

        sections.push( footer )

        return sections
    }

    isHeader({ fileSection: fileSection }) {
        return fileSection && fileSection.respondsTo('isHeader') && fileSection.isHeader()
    }

    isClassDefinition({ fileSection: fileSection }) {
        return fileSection && fileSection.respondsTo('isClassDefinition') && fileSection.isClassDefinition()
    }

    isFooter({ fileSection: fileSection }) {
        return fileSection && fileSection.respondsTo('isFooter') && fileSection.isFooter()
    }

    getSelectedClassDefinition() {
        const fileSection = this.getChildFlow({ id: 'selectedSectionContents' }).getValue()

        if( ! fileSection ) { return null }

        if( this.isFooter({ fileSection: fileSection }) ) {
            return this.getChildFlow({ id: 'fileSections' }).getChoices()[1]            
        }

        const sections = this.getChildFlow({ id: 'fileSections' }).getChoices()

        const index = sections.indexOf( fileSection )

        return sections[ Math.floor( index / 2 ) * 2 + 1 ]
    }

    getSelectedMethodName() {
        const selectedMethod = this.getChildFlow({ id: 'classMethods' }).getSelection()

        if( ! selectedMethod ) { return null }

        return selectedMethod.getName()
    }
}

module.exports = Classification.define(FileClassesEditionFlow)
