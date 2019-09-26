const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const ComponentsList = require('../../../gui/components/ComponentsList')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ListModelComponentProtocol_Implementation = require('../../../gui/protocols/ListModelComponentProtocol_Implementation')

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

    /// Rendering

    renderItem({ item: item, index: index, renderer: renderer }) {
        const className = item.getClassName()

        const component = this

        renderer.behaveAsTabsPageBuilder()

        renderer.bindYourself( function() {

            this.tabPage({ label: 'Header' }, function() {
                this.text({
                    model: item.getHeaderSourceCodeModel(),
                    splitProportion: 1.0 / 2,
                })
            })

            this.tabPage({ label: className }, function() {

                this.verticalSplitter( function() {

                    this.model( item.getSelectedMethodSourceCodeModel() )

                    this.listChoice( function() {
                        this.styles({
                            splitProportion: 1.0 / 2
                        })

                        this.model( item.getClassMethodsModel() )

                        this.column({
                            label: '',
                            getImageBlock: function(functionDefinition) { return component.getMethodIcon() },
                            imageWidth: 16,
                            imageHeight: 16,
                        })

                        this.column({
                            label: 'Methods',
                            getTextBlock: function(functionDefinition) { return functionDefinition.getFunctionName() },
                        })
                    })

                    this.text({
                        model: item.getSelectedMethodSourceCodeModel(),
                        splitProportion: 1.0 / 2,
                    })

                })
            })

        })
    }
}

module.exports = Classification.define(ClassesComponent)
