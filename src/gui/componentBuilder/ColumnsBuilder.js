const Column = require('./Column')

class ColumnsBuilder {
    /// Initializing

    afterInstantiation() {
        this.mergeProps({ columns: [] })
    }

    /// Columns

    column(columnProps) {
        const column = Column.withProps(columnProps)

        this.getProps().columns.push(column)
    }
}

module.exports = ColumnsBuilder