# Changelog

## v0.5.0

### Sirens

- Rewrote Sirens in the O language.
- ObjectBrowser.popupMenu bounds this to the MenuView.
- Added images to Sirens lists and trees.
- Added CHANGELOG.md file
- Updated README.md

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