# Changelog

## v0.8.0 (next release)

## v0.7.0

### Sirens

- Updated README.md.
- Code cleanup.
- Implemented the full javascript sintax visitor for esprima.
- Integrated comments to statements and expressions in esprima.
- Added 'Open file in new window ...' menu to ClassBrowser.
- Implemented the ClassDocumentationBrowser.
- Cleaned up the evaluation of scripts in the ObjectBrowser.
- Cleaned up accessing to the images resources.
- Improved existing icons.

### gui

- Implemented MenuSeparator.
- Rewrote Tabs and TabPage to include Components, not just Widgets.
- Implemented ToogleToolButton.
- Implemented Container to add scrolled containers.
- Implemented Separator.
- Implemented ImageFile widget.
- Implemented StockIcon widget
- Components can be easily re-rendered when a model changes.
- Implemented widget align attribute.
- Implemented widget margin attribute.
- Changed packFill, packExpand, packPadding to stackSize(filled, fixed, spread) and stackPadding.
- Images used in widgets are loaded from file only once and cached from there on.
- In widgets wrapped by a GtkScrolledWindow hscroll and vscroll bars are now configurable.

### O language

- Implemented ObjectWithProps.propsAndValuesDo

## v0.6.0

### Sirens

- Updated README.md.
- Rewrote StackView packExpand and packFill using viewAttributes.
- Implemented ClassEditor.
- Added ClassEditor bin file to package.json.
- Added https://travis-ci.org/ CI.

### gui

- Implemented MenuBar.
- Added viewAttributes to GtkView classification.
- Implemented FileChooser dialog.
- Implemented Tab pages.
- Implemented ToolBar.
- Added ComponentInstantiator.render(closure) method.
- Improved the naming of the paremeter methods of ListModel.
- Rewrote classifications with 'props' instance variables to use ObjectWithProps classification.
- Reimplemented ValueModel.
- Implemented ObjectPropModel and ObjectAttributeModel.
- Standarized all Views events subscriptions naming convention to handleEvent().
- Standarized all Views events subscriptions to always use an owned class method to allow overriding.
- Standarized all Component callbacks to always use an owned class method to allow overriding.
- TextView converts between "\n" and "\cr".
- Removed passing unnecessary cr parameters.
- Implemented BufferedAttributeModel.
- Implemented component.skip().

### O language

- The method Classification.define works with any classification object and not just with Classification.
- Implemented StringStream.
- Implemented IndentedStringStream.
- Implemented Protocol classification and Classification.implements(procotol) method.
- Implemented StringStreamProtocol.
- Rewrote Debuggable.
- Improved Classification protocol and tests.
- Started to document classifications and methods with the **native dsl within comments** style.
- Renamed ClassificationDefinition.assumptions to ClassificationDefinition.assumes.
- Renamed ClassificationDefinition.implementations to ClassificationDefinition.implements.
- Added ClassificationDefinition.expects.
- Implemented several protocols.
- Added the assertion that a Classification implements the protocols it declares in its ClassificationDefinition.implementations.
- Added ClassificationDefinition.classificationBehaviours.
- Implemented ObjectWithProps classification.
- Cleaned up and rewrote the MessageDispatcher implementation.
- Moved logic from MessageDispatcher to OInstance and Classification classifications.
- Removed all access to the implementation from OInstance and Classification.
- Added an objectId to each O instance for debugging. It could be improved or removed in the future.
- Implemented the optimized beforeMethod and afterMethod hooks.

## v0.5.0

### Sirens

- Rewrote Sirens in the O language.
- ObjectBrowser.popupMenu bounds this to the MenuView.
- Added images to Sirens lists and trees.
- Added CHANGELOG.md file.
- Updated README.md.

### gui

- Renamed menu.addItem and menu.addSeparator to menu.item and menu.separator.
- Rewrote gui in the O language.
- Implemented TreeView and ListView images.

### O language

- Implemented the basics of the O language.
- Added classification instance variables.
- Added assumptions.
- Implemented classifications as regular objects.
- Rewrote all classifications declarations.

## v0.4.0

### Sirens

- Added the first version of the StackBrowser.

### gui

-  Many refactorings to improve the implementation.

## v0.3.0

### Sirens

- Added context menus to the ObjectBrowser.
- Added context menus to the PrototypesBrowser.

### gui

- Added context menu support to TreeView.
- Added context menu support to ListView.
- Added context menu support to TextView.

## v0.2.0

### Sirens

- Fixed error: The ObjectBrowser crashes when inspecting an object with circular references.
- Changed label 'Showed inherit' to 'Show inherited'.
- Fixed error when double clicking an item in a ListView.
- Double click on a property or function on the PrototypesBrowser opens an ObjectBrowser on that value.
- Double click on a prototype in the PrototypesBrowser opens a new PrototypesBrowser on the selected prototype.
- Improved the display string for function objects.
- For WindowView changed the width and height settings from its size request to its default size.
- Corrections in the README file.

### gui

- Fixed error with pixbufs.

## v0.1.0

### Sirens

- Initial release of Sirens ObjectBrowser and PrototypesBrowser.