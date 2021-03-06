# Changelog

## v0.17.0

### O language

- Implemented the validation of methods invariant assertions.
- Implemented method post-condition assertions validations.
- Implemented method pre-condition assertions.
- Implemented custom assertions for method calls.
- Rewrote the MethodCallConstraintsValidator to compile a method CompiledAssertion
 on its first use and reuse the same CompiledAssertion from there on.
 Using the tests as a quick benchmark shows an optimization in the code that validates the assertions of a method call of around 150 times.

### FingerTips

### Skins

- TreeView now expands the selection when its set.
- Implemented confirmation dialog.
- Cleaned up references to GtkIcons and moved them to GtkViewsNamespace.
- Implemented a NullViewsNamespace and added protocol to choose which Views library to use.
- Cleaned up NamespaceFlowBuilder, removed duplicated code and moved it to NamespaceFlow.
- Moved the initialization of Gtk to GtkViewsNamespace. Now all the code related with Gtk is encapsulated in GtkViewsNamespace and can be switched to a different implementation by replacing the use of GtkViewsNamespace with a different NamespaceFlow.
- Changed FileLocation to use offsets instead of line-column.

### Sirens

- Implemented a basic browser of spec files.
- Improved how parsers are loaded and filtered.
- Added an icon for JsComment.
- If a TextualContents is a JsComment then uses a JsComment object.
- Implemented JsParserDsl.
- Changed the way file-inspector plugins are loaded to ensure the priority of the plugins. There may be more than one plugin defined for the same file type.
- Remove split-lines as a dependency.
- Cleaned up the classification SourceFile.
- Implemented a YAML files browser.
- Implemented writing a method to its file from the AppBrowser.
- Added confirmation to all documentation deletion actions.
- Changed the initialization of Gtk to not assume any particular GUI library.
- Cleaned up the tests and ensured that no Gtk object is created during the tests of Sirens.
- Splitted the implementation of the FilesRepository classification from its singleton use in the tests. Now tests can use multiple instances without colliding with each other.
- Moved the min-size out from the css files to the ComponentBuilder since it is a functional requirement, not a style.
- Improved and cleaned up the stacks layout definition. Now the layout is done through
 the use of a concrete .spaceFiller() component between consecutive components
 instead of using configuration parameters.

## v0.16.0

### O language

- Renamed .beSuchThat to .be .suchThat
- Reimplemented assertion expressions on methods activation.
- Improved error handling.
- Added .to .be .oInstance expectation
- Added array .atIndex expectation
- Added array .count expectation
- Implemented setUnclassifiedProperty to set unclassified properties to an OInstance.
- Implemented the ObjectWithNamespace classification to replace the use of global classes and new in methods.
- Implemented FolderPath and FilePath.
- Replaced all uses of 'path' and 'js' modules with FolderPath and FilePath.

### FingerTips

- Cleaned up Flows and Commands classifications.
- Implemented namespaces using NamespaceFlow.
- Cleaned up builders and flows dependencies.
- Rewrote the definitions of Commands and Flow methods.
- Implemented an autoloader alike utility for NamespaceFlow. It seems to gain ease
 of use and simplicity but it loses a lot of expressiveness and makes it very difficult
 to find out in which namespace an object is created.

### Skins

- Rewrote all aClassification.new() with this.namespace().aClassification.new() to make
use of the namespaces.
- Removed the dependency to Sirens.

### Sirens

- Implemented JsFileParser as a plugin
- Implemented JsonFileInspector as a plugin.
- Implemented documentation format reader as a plugin.
- Implemented ObjectBrowser plugins.
- Cleaned up and removed Pluggables file.
- Rewrote all components using SkinNamespace.
- Moved Sirens.js code to SirensFlow.
- Cleaned up browser components models.
- Cleaned up Sirens components require statements.
- Cleaned up references to global namespace from components. Remains to clean up GtkIcons and Resources references.
- Cleaned up Preferences and moved it to SirensFlow.
- Rewrote the definitions of Commands and Flow methods.
- Moved Sirens edition dialogs to a different namespace.
- Fixed FileDialog and FolderDialog open warnings.
- Removed file Skins.js since the SkinsNamepace made it obsolete.
- Rewrote FilesRepository test utility.

## v0.15.0

### Sirens

- Rewrote the documentation components and flows and integrated the documentation browsers into the AppBrowser.
- Added a background color in Playground components to identify in which text fields it is possible to select code and evaluate it on the fly.
- Added a row expansion of the roots to files and fileobjects trees.
- Improved the ObjectFile types plugins using dynamic flows.
- Moved the FileParser to Pluggables.
- Implemented a json files parser and inspector.
- Added a FileObject icon.
- Moved the SourceFileStructureParser out from SourceFile into FileInspectorFlow.
- Implemented a FileLocation object and moved the FilePosition and SourceFile object there.
- Removed the ClassDocumentationBrowser and its components.
- Removed the FileEditor windows.
- Wrote some tests for Sirens flows.

### FingerTips

- Added the findCommand() method.
- Reimplemented commands categories with commandsGroup.
- Implemented adding and removing child flows on the fly.
- Main Flows trigger a 'main-flow-built' after they are built.
- Several error fixes related with commands id paths.
- Implemented mocha expectations for FingerTips flows.
- Improved how to choose which commands to attach to a FlowPoint.
- Implemented a bubbleUp commands mechanism from a child flow to its ancestors without breaking the encapsulation of the child flow. This mechanism avoids having to push down application global callbacks and properties through intermediate flows, making refactorings and changes in the flow shape more simple.

### Skins

- Some fixes and improvements on the Views layer. These layer needs a rewrite to ease the layout of contained components.

### O language

- Implemented Classification.defineMethod() method.
- Renamed ParamsChecker to MethodCallConstraints. These validations need a rewrite from scratch.
- Implemented mocha custom expectations to test classifications.

## v0.14.0

### Sirens

- Changed file sections selector from a list to a tree.
- Fixed error in AppBrowserFlow.
- Cleaned up ClassDefinition sections and the references to the source file.
- Refactored FileFooterComponent and ClassHeaderComponent into PlainTextComponent.
- Removed unused attributes from components.
- Implemented first flow tests.
- Cleaned up SourceFile flows.
- Implemented file TextualContent.
- Implemented ObjectFiles and pluggable inspectors on them.
- Bug fixing.

### FingerTips

- Added documentation.
- Fixed errors related with Commands enabled/disabled state.
- Splitted the CommandController inner updates of the flow from the FlowPoints updates into two different and clear iterations.

### Skins

- Cleanup tests.

### O language

- Improved the method not found error message.

## v0.13.0

### Sirens

- Rewrote all the browsers using the new Flows architecture. Components no longer define the logic of the application, which was moved to Commands on each browser Flow definition.

### FingerTips

- Dropped BufferedAttributeModel, AttributeModel and ObjectPropModel in favor of the new and more simple Flows architecture.
- Implemented ValueFlow, BufferedValueFlow, ChoiceFlow and TreeChoiceFlow.
- Implemented FlowPoints.
- Separated the notification of events within a flow from the notifications of events to the FlowPoints.
- Ensured that the inner events of a Flow are always handled before the notifications to its FlowPoints.
- Made independent implementations of stateful commands that may be enabled or disabled from stateless commands that are always enabled.
- Added shortcuts to define Commands from the FlowBuilder in a different function or file.
- Removed the Flow object from the FlowPoint. A FlowPoint no longer has a reference to the Flow it is connected to, only to the push/pull functions to that Flow. This way the FlowPoint is isolated from the flow and unable to change or even get the Flow structure.
- FlowPoints can not access any child Flow, only other child FlowPoints.
- Removed the method FlowPoint.getActionHandler({ id: childId }). Now the a FlowPoint just makes the call to the Flow method of interest.
- Made the Flow to choose which methods to allow to each FlowPoint it creates.

### Skins

- Adapted Components to the new Flows architecture.

### O language


## v0.12.1

### Skins

- Fixed ListView and TreeView column assertion failure.
- Releases subscriptions to events when Views and Components are removed or closed.
- Initializes node events loop.

## v0.12.0

### Sirens

- Rewrote all the components using FingerTips commands.
- Renamed all application models from XYZModel to XYZFlow.
- Added some basic update of the enabled/disabled state of Sirens commands.

### FingerTips

- Implemented FlowModel and its FlowBuilder.
- Implemented Flow commands.

### Skins

- Renamed this library to Skins.
- Moved the models classifications to a different project. See FingerTips.
- Scrollbars in ListView now are optional.

### O language

- Added context information to the ParamsChecker validation messages.

## v0.11.0

### Sirens

- Removed the StackBrowser and its dependencies.
- AppBrowserModel shows the methods tab page when the selected file contains a class definition.
- Removed the StackTraceBrowser and its dependencies.
- Added tags to methods documentation and a filter by tags of a class methods.
- Added the method source code to class documentation.
- The app loads its styles from resources/css/sirens.css

### Skins

- Removed the implements of ComponentProtocol in all components that implements ComponentProtocol_Implementation since it is implicit.
- Refactored CheckBox to SingleSelectionCheckBox.
- Implemented MultipleSelectionCheckBox.
- Added basic support for CSS styles.
- Removed backgroundColor and foregroundColor.

### O language

- Renamed Debuggable.inspect() to Debuggable.browse().
- Tagged classification methods.

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