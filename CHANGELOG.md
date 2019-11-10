# Changelog

## v0.11.0 (next release)


### Sirens

- Removed the StackBrowser and its dependencies
- AppBrowserModel shows the methods tab page when the selected file contains a class definition.
- Removed the StackTraceBrowser and its dependencies.
- Added tags to methods documentation and a filter by tags of a class methods.
- Added the method source code to class documentation.
- The app loads its styles from resources/css/sirens.css

### gui

- Removed the implements of ComponentProtocol in all components that implements ComponentProtocol_Implementation since it is implicit.
- Refactored CheckBox to SingleSelectionCheckBox.
- Implemented MultipleSelectionCheckBox.
- Added basic support for CSS styles.
- Removed backgroundColor and foregroundColor.

### O language

- Renamed Debuggable.inspect() to Debuggable.browse()
- Tagged classification methods

## v0.10.0

### Sirens

- Replaced the binary classEditor by appBrowser.
- Implemented AppBrowser.
- DocumentationBrowser opens on the selected method.
- DocumentationBrowser shows the methods tabs instead of the class tab.
- Fixed the resize error on ClassDocumentation browser.
- ObjectBrowser shows OInstance objects.
- Fixed error when displaying the selected property in the ObjectBrowser.
- Added vertical scroll bars to edition dialogs.
- Uses of ObjectProperty now follows the pluggable behaviour pattern
- ObjectProperty inspector can be customized through Preferences.objectPropertiesInspectorPlugins

### gui

- Documenting componentBuilder classifications.
- Fixed the resize error on SplitterView when adding or removing child views.
- Renamed getTextBlock to getTextClosure
- Renamed getImageBlock to getImageClosure
- Improved Tree methods signatures.
- Made Labels selectable.

### O language

- Functions Symbol.for('nodejs.util.inspect.custom') and Symbol.toPrimitive are treated differently when called to an OInstance.
- Implemented OInstance.behaveAsAll method

## v0.9.0

### Sirens

- Improved error handling when evaluating code on the browsers.
- Added 'Evaluate selected code' to the playground context menu.
- Implemented node Playground.
- Added the bin/playground.js script.

### gui

- ToolBarButtons supports file images, not just icons.

### O language

- Added a simple yet more meaninggul toString() function to OInstances objects.
- Implemented ExtendedClassification and ExtendedInstantiator classifications to replace ParamsCheckerCreator.
- Added Debuggable.inspect() method.
- Documented classifications and protocols.
- Evaluates beforeAll.js script before running the tests.

## v0.8.0 

### Sirens

- Updated version number.
- When opening files the ClassEditor now remembers the last folder opened.
- Implemented edition of a class documentation.
- Fixed errors when lists and trees had no items selected.
- Implemented edition of a method documentation.

### gui

- Added params type cheking to all protocols.
- Added the optional parameter initialFolder to FileChooser
- Renamed toolBar.item to toolBar.button.
- Implemented Dialog.
- ChoiceModel sets to null instead of undefined when it has no item selection.

### O language

- Implemented ParamsChecker to add dynamic strict params validation to any object.
- Implemented ClassificationWithTypeChecking to add dynamic strict params validation to all new defined Classifications.
- Added recursive `implements` to declared `implements` in protocols.

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