const Classification = require('./Classification')

class ObjectWithProps {
    /// Definition

    static definition() {
        this.instanceVariables = ['props']
    }

    /// Initializing

    afterInstantiation() {
        this.props = {}
    }

    /// Asking

    hasProp({ key: propName }) {
        return this.props[propName] !== undefined
    }

    /// Reading

    getProps() {
        return this.props
    }

    getProp({ key: key, ifUndefined: absentClosure, defaultValue: defaultValue }) {
        const value = this.props[key]

        if( value === undefined ) {
            if( absentClosure !== undefined  ) {
                return absentClosure({ key: key, owner: this })
            }

            if( defaultValue !== undefined  ) {
                return defaultValue
            }
        }

        return value
    }

    /// Writing

    clearAllProps() {
        this.setProps( {} )

        return this
    }

    setProps(newProps) {
        this.props = newProps

        return this
    }

    mergeProps(additionalProps) {
        const newProps = Object.assign(this.props, additionalProps)

        return this.setProps(newProps)
    }

    removeProp({ key: key }) {
        delete this.props[key]

        return this
    }

    /// Iterating

    propsAndValuesDo(closure) {
        const props = this.props

        for( const propName in props ) {
            const value = props[ propName ]

            closure(propName, value)
        }

        return this
    }
}

module.exports = Classification.define(ObjectWithProps)