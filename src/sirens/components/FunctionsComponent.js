const Component = require('../../components/Component')

class FunctionsComponent extends Component {
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
                        label: 'Show inherit',
                        packExpand: false,
                        model: prototypesModel.getShowInheritModel(),
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

                    list.column({
                        label: 'Properties',
                        getTextBlock: (propertyModel) => {
                            return propertyModel.getKey()
                        },
                    })
                })
            })
        })
    }
}
module.exports = FunctionsComponent