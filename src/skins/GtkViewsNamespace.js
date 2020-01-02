const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

const CheckBoxView = require('./gtk-views/CheckBoxView')
const ComponentView = require('./gtk-views/ComponentView')
const ContainerView = require('./gtk-views/ContainerView')
const DialogView = require('./gtk-views/DialogView')
const FileChooserView = require('./gtk-views/FileChooserView')
const FolderChooserView = require('./gtk-views/FolderChooserView')
const ImageView = require('./gtk-views/ImageView')
const LabelView = require('./gtk-views/LabelView')
const ListView = require('./gtk-views/ListView')
const MenuBarView = require('./gtk-views/MenuBarView')
const MenuView = require('./gtk-views/MenuView')
const MenuItemView = require('./gtk-views/MenuItemView')
const MenuGroupView = require('./gtk-views/MenuGroupView')
const MenuItemSeparatorView = require('./gtk-views/MenuItemSeparatorView')
const RadioButtonView = require('./gtk-views/RadioButtonView')
const StackView = require('./gtk-views/StackView')
const SplitterView = require('./gtk-views/SplitterView')
const SeparatorView = require('./gtk-views/SeparatorView')
const TabsView = require('./gtk-views/TabsView')
const TabPageView = require('./gtk-views/TabPageView')
const TextButtonView = require('./gtk-views/TextButtonView')
const TextView = require('./gtk-views/TextView')
const ToolButtonView = require('./gtk-views/ToolButtonView')
const ToolBarView = require('./gtk-views/ToolBarView')
const ToolBarSeparatorView = require('./gtk-views/ToolBarSeparatorView')
const ToggleToolButtonView = require('./gtk-views/ToggleToolButtonView')
const TreeView = require('./gtk-views/TreeView')
const WindowView = require('./gtk-views/WindowView')

class GtkViewsNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'GtkViewsNamespace' }, function(thisFlow) {

            this.group({ id: 'Views' }, function() {

                this.createObject({
                    id: 'TreeView',
                    with: function({
                        getChildrenClosure: getChildrenClosure,
                        onSelectionChanged: onSelectionChanged,
                        onSelectionAction: onSelectionAction
                     }) {
                        return TreeView.new({
                            getChildrenClosure: getChildrenClosure,
                            onSelectionChanged: onSelectionChanged,
                            onSelectionAction: onSelectionAction
                        })  
                    },
                })

                this.createObject({
                    id: 'CheckBoxView',
                    with: function({ onClicked: onClickedClosure }) {
                        return CheckBoxView.new({ onClicked: onClickedClosure })
                    },
                })

                this.createObject({
                    id: 'ComponentView',
                    with: function() {
                        return ComponentView.new()
                    },
                })

                this.createObject({
                    id: 'ContainerView',
                    with: function({ hasScrollBars: hasScrollBars }) {
                        return ContainerView.new({ hasScrollBars: hasScrollBars })
                    },
                })

                this.createObject({
                    id: 'DialogView',
                    with: function({ title: title, buttons: buttons, windowView: windowView }) {
                        return DialogView.new({ title: title, buttons: buttons, windowView: windowView })
                    },
                })

                this.createObject({
                    id: 'FileChooserView',
                    with: function({
                        title: title,
                        mode: mode,
                        initialFolder: initialFolder,
                        windowView: windowView,
                        openButtonLabel: openButtonLabel,
                    }) {
                        return FileChooserView.new({
                            title: title,
                            mode: mode,
                            initialFolder: initialFolder,
                            windowView: windowView,
                            openButtonLabel: openButtonLabel,
                        })
                    },
                })

                this.createObject({
                    id: 'FolderChooserView',
                    with: function({
                        title: title,
                        mode: mode,
                        initialFolder: initialFolder,
                        windowView: windowView,
                        openButtonLabel: openButtonLabel,
                    }) {
                        return FolderChooserView.new({
                            title: title,
                            mode: mode,
                            initialFolder: initialFolder,
                            windowView: windowView,
                            openButtonLabel: openButtonLabel,
                        })
                    },
                })

                this.createObject({
                    id: 'ImageView',
                    with: function({ imageProps: imageProps }) {
                        return ImageView.new({ imageProps: imageProps })
                    },
                })

                this.createObject({
                    id: 'LabelView',
                    with: function() {
                        return LabelView.new()
                    },
                })

                this.createObject({
                    id: 'ListView',
                    with: function({
                        onSelectionChanged: onSelectionChanged,
                        onSelectionAction: onSelectionAction,
                        allowSelectionChange: allowSelectionChange,
                        hasScrollBars: hasScrollBars,
                    }) {
                        return ListView.new({
                            onSelectionChanged: onSelectionChanged,
                            onSelectionAction: onSelectionAction,
                            allowSelectionChange: allowSelectionChange,
                            hasScrollBars: hasScrollBars,
                        })
                    },
                })

                this.createObject({
                    id: 'RadioButtonView',
                    with: function() {
                       return RadioButtonView.new()
                    },
                })

                this.createObject({
                    id: 'MenuView',
                    with: function({ gtkWidget: gtkWidget } = {}) {
                        return MenuView.new({ gtkWidget: gtkWidget })
                    },
                })

                this.createObject({
                    id: 'MenuBarView',
                    with: function() {
                        return MenuBarView.new()
                    },
                })

                this.createObject({
                    id: 'MenuItemView',
                    with: function({ label: label, action: action }) {
                        return MenuItemView.new({ label: label, action: action })
                    },
                })

                this.createObject({
                    id: 'MenuGroupView',
                    with: function({ label: label }) {
                        return MenuGroupView.new({ label: label })
                    },
                })

                this.createObject({
                    id: 'MenuItemSeparatorView',
                    with: function() {
                        return MenuItemSeparatorView.new()
                    },
                })

                this.createObject({
                    id: 'StackView',
                    with: function({ orientation: orientation }) {
                        return StackView.new({ orientation: orientation })
                    },
                })

                this.createObject({
                    id: 'SplitterView',
                    with: function({ orientation: orientation }) {
                        return SplitterView.new({ orientation: orientation })
                    },
                })

                this.createObject({
                    id: 'SeparatorView',
                    with: function({ orientation: orientation }) {
                        return SeparatorView.new({ orientation: orientation })
                    },
                })

                this.createObject({
                    id: 'TabsView',
                    with: function({ onTabPageChanged: onTabPageChanged } = {}) {
                        return TabsView.new({ onTabPageChanged: onTabPageChanged })
                    },
                })

                this.createObject({
                    id: 'TabPageView',
                    with: function() {
                        return TabPageView.new()
                    },
                })

                this.createObject({
                    id: 'TextButtonView',
                    with: function({ onClicked: onClickedClosure, image: image }) {
                        return TextButtonView.new({ onClicked: onClickedClosure, image: image })
                    },
                })

                this.createObject({
                    id: 'TextView',
                    with: function({ onTextChanged: onTextChangedBlock, hasScrollBars: hasScrollBars }) {
                        return TextView.new({ onTextChanged: onTextChangedBlock, hasScrollBars: hasScrollBars })
                    },
                })

                this.createObject({
                    id: 'ToolButtonView',
                    with: function({ imageProps: imageProps, label: label, tooltip: tooltip, action: action }) {
                        return ToolButtonView.new({
                            imageProps: imageProps,
                            label: label,
                            tooltip: tooltip,
                            action: action
                        })
                    },
                })

                this.createObject({
                    id: 'ToolBarView',
                    with: function() {
                        return ToolBarView.new()
                    },
                })

                this.createObject({
                    id: 'ToolBarSeparatorView',
                    with: function() {
                        return ToolBarSeparatorView.new()
                    },
                })

                this.createObject({
                    id: 'ToggleToolButtonView',
                    with: function({ imageProps: imageProps, label: label, tooltip: tooltip, action: action }) {
                        return ToggleToolButtonView.new({
                            imageProps: imageProps,
                            label: label,
                            tooltip: tooltip,
                            action: action
                        })
                    },
                })

                this.createObject({
                    id: 'WindowView',
                    with: function({ onClosed: onClosed }) {
                        return WindowView.new({ onClosed: onClosed })
                    }
                })
            })
        })
    }
}

module.exports = Classification.define(GtkViewsNamespace)
