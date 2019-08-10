const PrimitiveComponent = require('../PrimitiveComponent')
const TextButtonView = require('../../views/TextButtonView')

class TextButton extends PrimitiveComponent {
    /// Initializing

    initializeModel(props) {
        super.initializeModel(props)

        if(props.text !== undefined) {
            this.getModel().setValue(props.text)
        }
    }

    createView() {
        return new TextButtonView({
            onClicked: this.props.onClicked
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const value = this.getModel().getValue()

        const getTextBlock = this.props.getTextBlock

        const text = getTextBlock ? getTextBlock(value) : value.toString()

        this.view.setText(text)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }
}

module.exports = TextButton