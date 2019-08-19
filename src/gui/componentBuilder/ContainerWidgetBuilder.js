const OInstance = require('../../o-language/classifications/OInstance')
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

const WidgetBuilder = require('./WidgetBuilder')

class ContainerWidgetBuilder {
    /// Instantiating

    static new() {
        return OInstance.new()
            .behaveAs(this)
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['childComponents']
        this.assumptions = [WidgetBuilder]
    }

    /// Initializing

    afterInstantiation() {
        this.childComponents = []
    }

    /// Accessing

    getChildComponents() {
        return this.childComponents
    }

    /// Building

    component(component) {
        this.childComponents.push(component)
    }

    window(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const builder = ContainerWidgetBuilder.new().yourself( (builder) => {
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

        const builder = ContainerWidgetBuilder.new().yourself( (builder) => {
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

        const builder = ContainerWidgetBuilder.new().yourself( (builder) => {
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

        const builder = ContainerWidgetBuilder.new().yourself( (builder) => {
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

        const builder = ContainerWidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
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

        const builder = WidgetBuilder.new().yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( props, builder.getProps() )

        const text = new RadioButton( props )

        this.childComponents.push(text)
    }
}

module.exports = ContainerWidgetBuilder