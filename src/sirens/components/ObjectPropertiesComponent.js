const Sirens = require('../../Sirens')
const Component = require('../../gui/components/Component')

class ObjectPropertiesComponent extends Component {
    /// Actions

    getSelectedObject() {
        let selectedValue = this.getModel().getSelectedPropertyValue()

        if(selectedValue === undefined) {
            selectedValue = this.getModel().getRootObject()
        }

        return selectedValue
    }

    inspectSelectedObject() {
        const selectedValue = this.getSelectedObject()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getSelectedObject()

        Sirens.browsePrototypes(selectedValue)
    }

    /// Building

    renderWith(builder) {
        builder.render(function (component) {

            this.treeChoice( (tree) => {
                tree.model(component.getModel().getObjectPropertiesTree())

                tree.styles({
                    splitProportion: 2.0/3.0,
                    showHeaders: false,
                    clickableHeaders: false,
                })

                tree.handlers({
                    onAction: component.inspectSelectedObject.bind(component),
                })

                tree.column({
                    label: '',
                    getTextBlock: (instVar) => { return instVar.displayString() },
                })

                tree.popupMenu(({menu: menu, ownerView: ownerView}) => {
                    const selectedObject =
                        component.getModel().getSelectedPropertyValue()

                    menu.addItem({
                        label: 'Browse it',
                        enabled: selectedObject !== undefined,
                        action: component.inspectSelectedObject.bind(component),
                    })

                    menu.addSeparator()

                    menu.addItem({
                        label: 'Browse its prototype',
                        enabled: selectedObject !== undefined,
                        action: component.browseSelectedObjectPrototypes.bind(component),
                    })
                })
            })
        })
    }
}
module.exports = ObjectPropertiesComponent