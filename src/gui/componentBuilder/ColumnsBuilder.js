const Classification = require('../../o-language/classifications/Classification')
const Column = require('./Column')

class ColumnsBuilder extends Classification {
    /// Initializing

    afterInstantiation() {
        this.mergeProps({ columns: [] })
    }

    /// Columns

    column(columnProps) {
        const column = Column.new(columnProps)

        this.getProps().columns.push(column)
    }
}

module.exports = ColumnsBuilder