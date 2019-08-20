const Widget = require('../Widget')
const LabelView = require('../../views/LabelView')

class Label extends Widget {
    /// Initializing

    initializeModel(props) {
        super.initializeModel(props)

        if(this.props.text !== undefined) {
            this.getModel().setValue(props.text)
        }
    }

    createView() {
        return LabelView.new()
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