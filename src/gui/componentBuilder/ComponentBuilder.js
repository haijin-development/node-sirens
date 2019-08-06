class ComponentBuilder {
    /// Initializing

    constructor(mainComponent) {
        this.mainComponent = mainComponent
        this.propsStack = [ {} ]
        this.componentsStack = [ [] ]
        this.modelStack = [ null ]
    }

    /// Rendering

    render(closure) {
        closure.call(this, this.mainComponent)

        this.mainComponent.addAllComponents(this.getCurrentComponents())

        return this.mainComponent
    }

    /// Components stack

    pushComponent() {
        this.propsStack.push({})
        this.componentsStack.push([])
        this.modelStack.push(null)
    }

    popComponent() {
        this.propsStack.pop()
        this.componentsStack.pop()
        this.modelStack.pop()
    }

    getCurrentComponents() {
        return this.componentsStack[this.componentsStack.length - 1]
    }

    getCurrentProps() {
        return this.propsStack[this.propsStack.length - 1]
    }

    getCurrentModel() {
        return this.modelStack[this.modelStack.length - 1]
    }

    /// Components

    withChildComponentDo(closure) {
        if (closure === undefined) {
            return {
                builtProps: {},
                childComponents: [],
                buildModel: null,
            }
        }

        this.pushComponent()

        closure.call(this)

        const builtComponents = {
            builtProps: this.getCurrentProps(),
            childComponents: this.getCurrentComponents(),
            buildModel: this.getCurrentModel(),
        }

        this.popComponent()

        return builtComponents
    }

    window(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)

        const Window = require('../components/containers/Window')
        const window = new Window(props)

        window.addAllComponents(subComponents.childComponents)

        this.getCurrentComponents().push(window)
    }

    horizontalStack(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)
        props.orientation = 'horizontal'

        const Stack = require('../components/containers/Stack')
        const stack = new Stack(props)

        stack.addAllComponents(subComponents.childComponents)

        this.getCurrentComponents().push(stack)
    }

    verticalStack(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)
        props.orientation = 'vertical'

        const Stack = require('../components/containers/Stack')
        const stack = new Stack(props)

        stack.addAllComponents(subComponents.childComponents)

        this.getCurrentComponents().push(stack)
    }

    horizontalSplitter(props, closure) {
        if (typeof(props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)
        props.orientation = 'horizontal'

        const Splitter = require('../components/containers/Splitter')
        const splitter = new Splitter(props)

        splitter.addAllComponents(subComponents.childComponents)

        this.getCurrentComponents().push(splitter)
    }

    verticalSplitter(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)
        props.orientation = 'vertical'

        const Splitter = require('../components/containers/Splitter')
        const splitter = new Splitter(props)

        splitter.addAllComponents(subComponents.childComponents)

        this.getCurrentComponents().push(splitter)
    }

    label(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)

        const Label = require('../components/widgets/Label')

        const label = new Label(props)

        this.getCurrentComponents().push(label)
    }

    text(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)

        const Text = require('../components/widgets/Text')

        const text = new Text(props)

        this.getCurrentComponents().push(text)
    }

    textButton(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)

        const TextButton = require('../components/widgets/TextButton')

        const textButton = new TextButton(props)

        this.getCurrentComponents().push(textButton)
    }

    checkBox(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)

        const CheckBox = require('../components/widgets/CheckBox')

        const checkBox = new CheckBox(props)

        this.getCurrentComponents().push(checkBox)
    }

    radioButton(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const subComponents = this.withChildComponentDo(closure)

        props = Object.assign(subComponents.builtProps, props)

        const RadioButton = require('../components/widgets/RadioButton')

        const radioButton = new RadioButton(props)

        this.getCurrentComponents().push(radioButton)
    }

    listChoice(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const {ChoicesListBuilder} = require('./ChoicesListBuilder')

        const additionalProps = new ChoicesListBuilder().render(closure)

        const mergedProps = Object.assign(additionalProps, props)

        const ChoicesList = require('../components/widgets/ChoicesList')

        const list = new ChoicesList(mergedProps)

        this.getCurrentComponents().push(list)
    }

    treeChoice(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        const {ChoicesListBuilder} = require('./ChoicesListBuilder')

        const additionalProps = new ChoicesListBuilder().render(closure)

        const mergedProps = Object.assign(additionalProps, props)

        const ChoicesTree = require('../components/widgets/ChoicesTree')

        const tree = new ChoicesTree(mergedProps)

        this.getCurrentComponents().push(tree)
    }

    component(component) {
        this.getCurrentComponents().push(component)
    }

    /// Popup menu

    popupMenu(block) {
        this.mergeToCurrentProps({populatePopupMenuBlock: block})
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
        this.propsStack[this.propsStack.length - 1] =
            Object.assign(this.getCurrentProps(), props)
    }
}

module.exports = ComponentBuilder