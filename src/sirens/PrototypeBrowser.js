const Sirens = require('../Sirens')
const Component = require('../components/Component')
const PrototypesBrowserModel = require('./models/PrototypesBrowserModel')
const FunctionsComponent = require('./components/FunctionsComponent')

class PrototypeBrowser extends Component {
    defaultModel() {
        return new PrototypesBrowserModel(this.props.prototype)
    }

    /// Actions

    browseSelectedObjectFunctions() {
        const selectedValue = this.getModel().getSelectedInstanceVariableValue()
    }

    /// Actions

    browseSelectedPrototype() {
        const selectedPrototype = this.getModel().getSelectedPrototype()

        Sirens.browsePrototypes(selectedPrototype)
    }

    /// Icons

    getImageFor(object) {
        return 'resources/icons/array.png'
    }

    /// Building

    renderWith(builder) {
        const prototypesModel = this.getModel()

        builder.render(function (component) {
            this.window(() => {
                this.styles({
                    title: 'Prototypes Browser',
                    width: 500,
                    height: 400,
                })

                this.verticalSplitter( () => {
                    this.horizontalSplitter(() => {
                        this.styles({
                            splitProportion: 2.0/3.0,
                        })

                        this.listChoice((list) => {
                            list.model(prototypesModel.getPrototypesModel())

                            list.styles({
                                splitProportion: 1.0/4.0,
                            })

                            list.handlers({
                                onAction: component.browseSelectedPrototype.bind(component),
                            })

                            list.column({
                                label: 'Prototypes',
                                getTextBlock: (object) => {
                                    return object.constructor.name
                                },
                            })
                        })

                        this.component(
                            new FunctionsComponent({
                                model: prototypesModel,
                                splitProportion: 3.0/4.0,
                            })
                        )
                    })

                    this.text({
                        splitProportion: 1.0/3.0,
                        model: prototypesModel.getSelectedPropDescriptionModel(),
                    })
                })
            })
        })
    }
}
module.exports = PrototypeBrowser