const PrimitiveComponent = require('../PrimitiveComponent')
const ValueModel = require('../../models/ValueModel')
const CheckBoxView = require('../../views/CheckBoxView')

class CheckBox extends PrimitiveComponent {
    /// Initializing

    initializeModel(props) {
        super.initializeModel(props)

        if(props.value !== undefined) {
            this.getModel().setValue(props.value)
        }
    }

    createView() {
        return new CheckBoxView({
            onClicked: this.onClicked.bind(this)
        })
    }

    defaultModel() {
        return new ValueModel({value: false})
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const text = this.props.label
        const value = this.getModel().getValue()

        this.view.setText(text)
        this.view.setValue(value)
    }

    /// Events

    onValueChanged({newValue: newValue, oldValue: oldValue}) {
        this.synchronizeViewFromModel()
    }

    onClicked() {
        this.getModel().setValue( this.getView().getValue() )
    }
}

module.exports = CheckBox