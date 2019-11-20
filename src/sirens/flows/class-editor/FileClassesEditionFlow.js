const path = require('path')
const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const PlugabbleDisplayable = require('../../objects/PlugabbleDisplayable')

class FileClassesEditionFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowModel]
    }

    /// Building

    buildWith(flow) {
        flow.main( function(fileContents) {

            this.whenObjectChanges( ({ newValue: sourceFile }) => {
                fileContents.getChild({ id: 'fileSections' }).setChoices( fileContents.getSectionsDefinedInOpenedFile() )
                fileContents.getChild({ id: 'fileSections' }).setSelectionIndex({ index: 0 })
            })

            this.choice({
                id: 'fileSections',
                choices: [],
                whenSelectionChanges: ({ newValue: fileSection }) => {
                    fileContents.getChild({ id: 'selectedSectionContents' }).setObject( fileSection )
                },
            })

            this.object({
                id: 'selectedSectionContents',
            }, function(selectedSectionContents) {

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

                    selectedSectionContents.getChild({ id: 'classMethods' }).setChoices( methods )

                    selectedSectionContents.getChild({ id: 'editedContents' }).setValue( editedContents )
                 })

                this.choice({
                    id: 'classMethods',
                    choices: [],
                    whenSelectionChanges: ({ newValue: methodDefinition }) => {
                        const editedContents = selectedSectionContents.getChild({ id: 'editedContents' })

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

    /// Querying

    getSourceFile() {
        return this.getObject()
    }

    setSourceFile({ sourceFile: sourceFile }) {
        return this.setObject( sourceFile )
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
        const fileSection = this.getChild({ id: 'selectedSectionContents' }).getObject()

        if( ! fileSection ) { return null }

        if( this.isFooter({ fileSection: fileSection }) ) {
            return this.getChild({ id: 'fileSections' }).getChoices()[1]            
        }

        const sections = this.getChild({ id: 'fileSections' }).getChoices()

        const index = sections.indexOf( fileSection )

        return sections[ Math.floor( index / 2 ) * 2 + 1 ]
    }

    getSelectedMethodName() {
        const selectedMethod = this.getChild({ id: 'classMethods' }).getSelectionValue()

        if( ! selectedMethod ) { return null }

        return selectedMethod.getName()
    }
}

module.exports = Classification.define(FileClassesEditionFlow)
