const PrimitiveComponent = require('../PrimitiveComponent')
const LabelView = require('../../views/LabelView')

class Label extends PrimitiveComponent {
    /// Initializing

    initializeModel(props) {
        super.initializeModel(props)

        if(this.props.text !== undefined) {
            this.getModel().setValue(props.text)
        }
    }

    createView() {
        return new LabelView()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const text = this.getModel().getValue()

        this.view.setText(text)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }
}

module.exports = Label