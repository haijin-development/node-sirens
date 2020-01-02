const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

const ComponentRenderer = require('./componentBuilder/ComponentRenderer')
const ContainerWidgetBuilder = require('./componentBuilder/ContainerWidgetBuilder')
const WidgetBuilder = require('./componentBuilder/WidgetBuilder')
const ColumnsBuilder = require('./componentBuilder/ColumnsBuilder')
const Column = require('./componentBuilder/Column')
const AntiComponent = require('./componentBuilder/AntiComponent')
const MenuBar = require('./components/menus/MenuBar')
const MenuBuilder = require('./componentBuilder/MenuBuilder')
const ToolBarBuilder = require('./componentBuilder/ToolBarBuilder')
const MenuGroupBuilder = require('./componentBuilder/MenuGroupBuilder')
const MenuGroup = require('./components/menus/MenuGroup')
const MenuItem = require('./components/menus/MenuItem')
const MenuItemSeparator = require('./components/menus/MenuItemSeparator')
const ToogleToolButton = require('./components/menus/ToogleToolButton')

const ChoicesTree = require('./components/widgets/ChoicesTree')
const ChoicesList = require('./components/widgets/ChoicesList')
const Container = require('./components/containers/Container')
const Dialog = require('./components/dialogs/Dialog')
const FileChooser = require('./components/dialogs/FileChooser')
const FolderChooser = require('./components/dialogs/FolderChooser')
const Image = require('./components/widgets/Image')
const Label = require('./components/widgets/Label')
const RadioButton = require('./components/widgets/RadioButton')
const MultipleSelectionCheckBox = require('./components/widgets/MultipleSelectionCheckBox')
const SingleSelectionCheckBox = require('./components/widgets/SingleSelectionCheckBox')
const Splitter = require('./components/containers/Splitter')
const Stack = require('./components/containers/Stack')
const Separator = require('./components/widgets/Separator')
const Tabs = require('./components/containers/Tabs')
const TabPage = require('./components/containers/TabPage')
const Text = require('./components/widgets/Text')
const TextButton = require('./components/widgets/TextButton')
const ToolBar = require('./components/menus/ToolBar')
const ToolButton = require('./components/menus/ToolButton')
const ToolBarSeparator = require('./components/menus/ToolBarSeparator')
const Window = require('./components/containers/Window')

const CheckBoxView = require('./gtk-views/CheckBoxView')
const ComponentView = require('./gtk-views/ComponentView')
const FileChooserView = require('./gtk-views/FileChooserView')
const LabelView = require('./gtk-views/LabelView')
const ListView = require('./gtk-views/ListView')
const MenuBarView = require('./gtk-views/MenuBarView')
const MenuItemView = require('./gtk-views/MenuItemView')
const MenuGroupView = require('./gtk-views/MenuGroupView')
const RadioButtonView = require('./gtk-views/RadioButtonView')
const StackView = require('./gtk-views/StackView')
const SplitterView = require('./gtk-views/SplitterView')
const TabsView = require('./gtk-views/TabsView')
const TabPageView = require('./gtk-views/TabPageView')
const TextButtonView = require('./gtk-views/TextButtonView')
const TextView = require('./gtk-views/TextView')
const ToolButtonView = require('./gtk-views/ToolButtonView')
const ToolBarView = require('./gtk-views/ToolBarView')
const ToolBarSeparatorView = require('./gtk-views/ToolBarSeparatorView')
const TreeView = require('./gtk-views/TreeView')
const WindowView = require('./gtk-views/WindowView')

const FingerTipsNamespace = require('../finger-tips/FingerTipsNamespace')
const GtkViewsNamespace = require('./GtkViewsNamespace')

class SkinsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        const fingerTipsNamespace = FingerTipsNamespace.new()
        const viewsNamespace = GtkViewsNamespace.new()

        flow.main({ id: 'SkinsNamespace' }, function(thisFlow) {

            this.defineMethodsAsCreateObjectCommands({
                methods: [
                    'AntiComponent',
                    'Column',
                    'ColumnsBuilder',
                    'ComponentRenderer',
                    'ContainerWidgetBuilder',
                    'MenuBuilder',
                    'ToolBarBuilder',
                    'ToolBar',
                    'ToogleToolButton',
                    'ToolButton',
                    'ToolBarSeparator',
                    'MenuBar',
                    'MenuGroupBuilder',
                    'MenuGroup',
                    'MenuItem',
                    'MenuItemSeparator',
                    'WidgetBuilder',
                    'Window',
                    'FileChooser',
                    'FolderChooser',
                    'Image',
                    'ChoicesList',
                    'ChoicesTree',
                    'Container',
                    'Dialog',
                    'Label',
                    'RadioButton',
                    'MultipleSelectionCheckBox',
                    'SingleSelectionCheckBox',
                    'Splitter',
                    'Stack',
                    'Separator',
                    'Tabs',
                    'TabPage',
                    'TextButton',
                    'Text',
                ],
            })

            this.namespace({ id: 'Views', from: viewsNamespace })
            this.namespace({ id: 'Models', from: fingerTipsNamespace })
        })
    }

    // Builders

    AntiComponent(props) {
        return AntiComponent.new(props)
    }

    Column(props = {}) {
        return Column.new(props)        
    }

    ColumnsBuilder(props) {
        return ColumnsBuilder.new(props)        
    }

    ComponentRenderer({ rootComponent: rootComponent } = {}) {
        return ComponentRenderer.new({ rootComponent: rootComponent })
    }

    ContainerWidgetBuilder(props) {
        return ContainerWidgetBuilder.new(props)
    }

    MenuBuilder(props) {
        return MenuBuilder.new(props)
    }

    ToolBarBuilder(props) {
        return ToolBarBuilder.new(props)
    }

    ToolBar(props) {
        return ToolBar.new(props)
    }

    ToogleToolButton(props) {
        return ToogleToolButton.new(props)
    }

    ToolButton(props) {
        return ToolButton.new(props)
    }

    ToolBarSeparator(props) {
        return ToolBarSeparator.new(props)
    }

    MenuBar(props) {
        return MenuBar.new(props)
    }

    MenuGroupBuilder(props) {
        return MenuGroupBuilder.new(props)
    }

    MenuGroup(props) {
        return MenuGroup.new(props)
    }

    MenuItem(props) {
        return MenuItem.new(props)
    }

    MenuItemSeparator() {
        return MenuItemSeparator.new()
    }

    WidgetBuilder(props) {
        return WidgetBuilder.new(props)
    }

    // Components

    Window(props) {
        return Window.new(props)
    }

    FileChooser(props) {
        return FileChooser.new(props)
    }

    FolderChooser(props) {
      return FolderChooser.new(props)
    }

    Image(props) {
      return Image.new(props)
    }

    ChoicesList(props) {
        return ChoicesList.new(props)
    }

    ChoicesTree(props) {
        return ChoicesTree.new(props)
    }

    Container(props) {
        return Container.new(props)
    }

    Dialog(props) {
        return Dialog.new(props)
    }

    Label(props) {
        return Label.new(props)
    }

    RadioButton(props) {
        return RadioButton.new(props)
    }

    MultipleSelectionCheckBox(props) {
        return MultipleSelectionCheckBox.new(props)        
    }

    SingleSelectionCheckBox(props) {
        return SingleSelectionCheckBox.new(props)
    }

    Splitter(props) {
        return Splitter.new(props)
    }

    Stack(props) {
        return Stack.new(props)
    }

    Separator(props) {
        return Separator.new(props)
    }

    Tabs(props) {
        return Tabs.new(props)
    }

    TabPage(props) {
        return TabPage.new(props)
    }

    TextButton(props) {
        return TextButton.new(props)
    }

    Text(props) {
        return Text.new(props)
    }
}

module.exports = Classification.define(SkinsNamespace)
