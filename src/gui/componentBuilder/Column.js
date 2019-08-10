class Column {
    constructor(props) {
        this.props = Object.assign(
            {type: 'string', label: '',},
            props
        )
    }

    getLabel() {
        return this.props.label
    }

    getType() {
        return this.props.type
    }

    getDisplayTextOf(item) {
        if(this.props.getTextBlock === undefined) {
            return item.toString()
        }

        return this.props.getTextBlock(item)
    }
}

module.exports = Column