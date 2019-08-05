const Column = require('./Column')

class ChoicesListBuilder {
    /// Initializing

    constructor() {
        this.props = {
            columns: []
        }
    }

    render(closure) {
        closure(this)

        return this.props
    }

    /// Columns

    column(columnProps) {
        const column = new Column(columnProps)

        this.props.columns.push(column)
    }

    /// Props

    model(model) {
        return this.mergeToCurrentProps({model: model})
    }

    styles(props) {
        return this.mergeToCurrentProps(props)
    }

    handlers(props) {
        return this.mergeToCurrentProps(props)
    }

    popupMenu(populatePopupMenuBlock) {
        this.mergeToCurrentProps({populatePopupMenuBlock: populatePopupMenuBlock})
    }

    mergeToCurrentProps(props) {
        this.props = Object.assign(this.props, props)
    }
}

exports.ChoicesListBuilder = ChoicesListBuilder