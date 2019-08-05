const Sirens = require('../../Sirens')
const Component = require('../../components/Component')

class FunctionsComponent extends Component {
    /// Actions

    browseSelectedProperty() {
        const selectedPropertyValue = this.getModel().getSelectedPropValue()

        Sirens.browseObject(selectedPropertyValue)
    }

    /// Building

    renderWith(builder) {
        const prototypesModel = this.getModel()

        builder.render(function (component) {
            this.verticalStack( () => {
                this.horizontalStack( () => {
                    this.styles({
                        packExpand: false,
                    })

                    this.checkBox({
                        label: 'Show inherited',
                        packExpand: false,
                        model: prototypesModel.getshowInheritedModel(),
                    })

                    this.checkBox({
                        label: 'Show functions',
                        packExpand: false,
                        model: prototypesModel.getShowFunctionsModel(),
                    })

                    this.checkBox({
                        label: 'Show props',
                        packExpand: false,
                        model: prototypesModel.getShowPropsModel(),
                    })
                })

                this.listChoice((list) => {
                    list.model(prototypesModel.getSelectedPrototypePropsModel())

                    list.handlers({
                        onAction: component.browseSelectedProperty.bind(component),
                    })

                    list.column({
                        label: 'Properties',
                        getTextBlock: (ObjectProperty) => {
                            return ObjectProperty.getKey()
                        },
                    })

                    list.popupMenu(({menu: menu, ownerView: ownerView}) => {
                        const selectedObject =
                            component.getModel().getSelectedPropValue()

                        menu.addItem({
                            label: 'Browse it',
                            enabled: selectedObject !== undefined,
                            action: component.browseSelectedProperty.bind(component),
                        })
                    })
                })
            })
        })
    }
}
module.exports = FunctionsComponent