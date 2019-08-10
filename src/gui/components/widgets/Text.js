const PrimitiveComponent = require('../PrimitiveComponent')
const TextView = require('../../views/TextView')

class Text extends PrimitiveComponent {
    /// Initializing

    initializeModel(props) {
        super.initializeModel(props)

        if(props.text !== undefined) {
            this.getModel().setValue(props.text)
        }
    }

    createView() {
        return new TextView({onTextChanged: this.onTextChanged.bind(this)})
    }

    /// Querying

    getSelectedText() {
        return this.view.getSelectedText()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const text = this.getModel().getValue()

        this.view.setText(text)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        if(this.updatingModel === true) {
            return
        }

        this.synchronizeViewFromModel()
    }

    onTextChanged(text) {
        this.duringModelUpdate( () => {
            this.getModel().setValue(text)
        })
    }
}

module.exports = Text