const O = require('../../o-language/O')
const ColumnsBuilder = require('./ColumnsBuilder')
const Window = require('../components/containers/Window')
const Stack = require('../components/containers/Stack')
const Splitter = require('../components/containers/Splitter')
const ChoicesList = require('../components/widgets/ChoicesList')
const ChoicesTree = require('../components/widgets/ChoicesTree')
const Label = require('../components/widgets/Label')
const Text = require('../components/widgets/Text')
const CheckBox = require('../components/widgets/CheckBox')
const TextButton = require('../components/widgets/TextButton')
const RadioButton = require('../components/widgets/RadioButton')

class GenericComponentBuilder {
    /// Instantiating

    static new() {
        return this.newWithProps({})
    }

    static newWithProps(props) {
        return O.new()
            .behaveAs(this)
            .mergeProps(props)
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['props', 'childComponents']
    }

    /// Initializing

    afterInstantiation() {
        this.props = {}
        this.childComponents = []
    }

    /// Accessing

    getChildComponents() {
        return this.childComponents
    }

    getProps() {
        return this.props
    }

    mergeProps(additionalProps) {
        this.props = Object.assign(this.props, additionalProps)

        return this
    }

    /// Setting props

    model(model) {
        this.mergeProps({ model: model })
    }

    styles(props) {
        this.mergeProps(props)
    }

    handlers(props) {
        this.mergeProps(props)
    }

    popupMenu(populatePopupMenuBlock) {
        this.mergeProps({ populatePopupMenuBlock: populatePopupMenuBlock })
    }

    /// Building

    build(closure, ...params) {
        if( closure === undefined ) { return }

        closure.call(this, ...params)
    }

    component(component) {
        this.childComponents.push(component)
    }

    window(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const window = new Window( props )

        window.addAllComponents( builder.getChildComponents() )

        this.childComponents.push(window)
    }

    verticalStack(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps(), { orientation: 'vertical' })

        const stack = new Stack( props )

        stack.addAllComponents( builder.getChildComponents() )

        this.childComponents.push(stack)
    }

    horizontalStack(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps(), { orientation: 'horizontal' })

        const stack = new Stack( props )

        stack.addAllComponents( builder.getChildComponents() )

        this.childComponents.push(stack)
    }

    verticalSplitter(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps(), { orientation: 'vertical' })

        const splitter = new Splitter( props )

        splitter.addAllComponents( builder.getChildComponents() )

        this.childComponents.push(splitter)
    }

    horizontalSplitter(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps(), { orientation: 'horizontal' })

        const splitter = new Splitter( props )

        splitter.addAllComponents( builder.getChildComponents() )

        this.childComponents.push(splitter)
    }

    listChoice(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
            builder
                .behaveAs(ColumnsBuilder)
                .build(closure)
        })

        props = Object.assign( props, builder.getProps() )

        const tree = new ChoicesList( props )

        this.childComponents.push(tree)
    }

    treeChoice(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
            builder
                .behaveAs(ColumnsBuilder)
                .build(closure)
        })

        props = Object.assign( props, builder.getProps() )

        const tree = new ChoicesTree( props )

        this.childComponents.push(tree)
    }

    label(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const text = new Label( props )

        this.childComponents.push(text)
    }

    text(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const text = new Text( props )

        this.childComponents.push(text)
    }

    checkBox(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const text = new CheckBox( props )

        this.childComponents.push(text)
    }

    textButton(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const text = new TextButton( props )

        this.childComponents.push(text)
    }

    radioButton(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = GenericComponentBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const text = new RadioButton( props )

        this.childComponents.push(text)
    }
}

module.exports = GenericComponentBuilder