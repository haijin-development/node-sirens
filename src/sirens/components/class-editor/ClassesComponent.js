const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const ComponentsList = require('../../../gui/components/ComponentsList')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ListModelComponentProtocol_Implementation = require('../../../gui/protocols/ListModelComponentProtocol_Implementation')
const SingleClassMenu = require('./SingleClassMenu')
const Sirens = require('../../../Sirens')

class ClassesComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentsList]
        this.implements = [
            ComponentProtocol_Implementation,
            ListModelComponentProtocol_Implementation
        ]
    }

    /// Icons

    getMethodIcon() {
        return path.resolve( __dirname + '/../../../../resources/icons/function.png' )
    }

    /// Actions

    openDocumentationBrowser(classEditionModel) {
        Sirens.browseDocumentation({ model: classEditionModel })
    }

    /// Rendering

    renderItem({ item: classEditionModel, index: index, renderer: renderer }) {
        const className = classEditionModel.getClassName()

        const component = this

        renderer.behaveAsTabsPageBuilder()

        renderer.bindYourself( function() {

            this.tabPage({ label: 'Header' }, function() {
                this.text({
                    model: classEditionModel.getHeaderSourceCodeModel(),
                    splitProportion: 1.0 / 2,
                })
            })

            this.tabPage({ label: className }, function() {

                this.verticalStack( function() {

                    this.component(
                        SingleClassMenu.new({
                            openDocumentationBrowser: () => {
                                component.openDocumentationBrowser(classEditionModel)
                            }
                        })
                    )

                    this.verticalSplitter( function() {

                        this.model( classEditionModel.getSelectedMethodSourceCodeModel() )

                        this.listChoice( function() {

                            this.model( classEditionModel.getClassMethodsModel() )

                            this.styles({
                                splitProportion: 1.0 / 2
                            })

                            this.column({
                                label: '',
                                getImageBlock: function(functionDefinition) { return component.getMethodIcon() },
                                imageWidth: 16,
                                imageHeight: 16,
                            })

                            this.column({
                                getTextBlock: function(functionDefinition) { return functionDefinition.getFunctionName() },
                            })
                        })

                        this.text({
                            model: classEditionModel.getSelectedMethodSourceCodeModel(),
                            splitProportion: 1.0 / 2,
                        })

                    })

                })

            })

        })
    }
}

module.exports = Classification.define(ClassesComponent)
