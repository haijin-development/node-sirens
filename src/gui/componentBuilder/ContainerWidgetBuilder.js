const Classification = require('../../o-language/classifications/Classification')
const ColumnsBuilder = require('./ColumnsBuilder')
const MenuBuilder = require('./MenuBuilder')
const ToolBarBuilder = require('./ToolBarBuilder')

const Window = require('../components/containers/Window')
const Dialog = require('../components/dialogs/Dialog')
const Container = require('../components/containers/Container')
const Stack = require('../components/containers/Stack')
const Splitter = require('../components/containers/Splitter')
const Tabs = require('../components/containers/Tabs')
const TabPage = require('../components/containers/TabPage')
const Separator = require('../components/widgets/Separator')
const ChoicesList = require('../components/widgets/ChoicesList')
const ChoicesTree = require('../components/widgets/ChoicesTree')
const Label = require('../components/widgets/Label')
const Text = require('../components/widgets/Text')
const CheckBox = require('../components/widgets/CheckBox')
const TextButton = require('../components/widgets/TextButton')
const RadioButton = require('../components/widgets/RadioButton')
const Image = require('../components/widgets/Image')

const WidgetBuilder = require('./WidgetBuilder')

class ContainerWidgetBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['childComponents']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.childComponents = []
    }

    /// Accessing

    getChildComponents() {
        return this.childComponents
    }

    getLastChildComponent() {
        return this.childComponents[ this.childComponents.length - 1 ]
    }

    /// Building

    component(component) {
        if( component === undefined ) {
            throw new Error(`The component can not be undefined.`)
        }

        this.childComponents.push(component)
    }

    window(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const window = Window.new( builder.getProps() )

        window.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(window)
    }

    dialog(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const window = Dialog.new( builder.getProps() )

        window.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(window)
    }

    container(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const container = Container.new( builder.getProps() )

        container.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(container)
    }

    verticalStack(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'vertical' })

        const stack = Stack.new( props )

        stack.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(stack)
    }

    horizontalStack(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'horizontal' })

        const stack = Stack.new( props )

        stack.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(stack)
    }

    verticalSplitter(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'vertical' })

        const splitter = Splitter.new( props )

        splitter.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(splitter)
    }

    horizontalSplitter(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        props = Object.assign( builder.getProps(), { orientation: 'horizontal' })

        const splitter = Splitter.new( props )

        splitter.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(splitter)
    }

    tabs(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const tabs = Tabs.new( props )

        tabs.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(tabs)
    }

    tabPage(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = this.thisClassification().new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const tabPage = TabPage.new( props )

        tabPage.addAllChildrenComponents( builder.getChildComponents() )

        this.childComponents.push(tabPage)
    }

    verticalSeparator(props) {
        const defaultProps = {
            viewAttributes: {
                stackSize: 'fixed',
            }
        }

        props = Object.assign(defaultProps, props)
        props = Object.assign(props, { orientation: 'vertical' })

        const separator = Separator.new(props)

        this.childComponents.push(separator)
    }

    horizontalSeparator() {
        const defaultProps = {
            viewAttributes: {
                stackSize: 'fixed',
            }
        }

        props = Object.assign(defaultProps, props)
        props = Object.assign(props, { orientation: 'horizontal' })

        const separator = Separator.new(props)

        this.childComponents.push(separator)
    }

    listChoice(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = ColumnsBuilder.new(props).yourself( (builder) => {
            builder.build(closure)
        })

        const tree = ChoicesList.new( builder.getProps() )

        this.childComponents.push(tree)
    }

    treeChoice(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = ColumnsBuilder.new(props).yourself( (builder) => {
            builder.build(closure)
        })

        const tree = ChoicesTree.new( builder.getProps() )

        this.childComponents.push(tree)
    }

    label(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const label = Label.new( builder.getProps() )

        this.childComponents.push(label)
    }

    text(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = Text.new( builder.getProps() )

        this.childComponents.push(text)
    }

    checkBox(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = CheckBox.new( builder.getProps() )

        this.childComponents.push(text)
    }

    textButton(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = TextButton.new( builder.getProps() )

        this.childComponents.push(text)
    }

    radioButton(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const text = RadioButton.new( builder.getProps() )

        this.childComponents.push(text)
    }

    menuBar(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const menuBar = MenuBuilder.new(props).createFromClosure(closure)

        this.childComponents.push(menuBar)
    }

    toolBar(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const toolBar = ToolBarBuilder.new(props).createFromClosure(closure)

        this.childComponents.push(toolBar)
    }

    image(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const builder = WidgetBuilder.new(props).yourself( (builder) => {
                builder.build(closure)
            })

        const image = Image.new( builder.getProps() )

        this.childComponents.push(image)
    }
}

module.exports = Classification.define(ContainerWidgetBuilder)