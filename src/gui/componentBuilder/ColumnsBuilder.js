const Classification = require('../../o-language/classifications/Classification')
const WidgetBuilder = require('./WidgetBuilder')
const Column = require('./Column')

class ColumnsBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    initialize(props) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.mergeProps({ columns: [] })
    }

    /// Columns

    column(columnProps) {
        const column = Column.new(columnProps)

        this.getProps().columns.push(column)
    }
}

module.exports = Classification.define(ColumnsBuilder)