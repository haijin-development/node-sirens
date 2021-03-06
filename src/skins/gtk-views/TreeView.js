const nodeGtk = require('node-gtk')
const Gtk = nodeGtk.require('Gtk', '3.0')
const GObject = nodeGtk.require('GObject')
const GtkTypes = require('./constants/GtkTypes')
const GtkScroll = require('./constants/GtkScroll')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImage = require('./GtkImage')

class TreeView {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'scrolledWindow', 'treeStore', 'treeView', 'columns',
            'getChildrenClosure', 'onSelectionChanged', 'onSelectionAction',
            'placeholder'
        ]
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({
            getChildrenClosure: getChildrenClosure,
            onSelectionChanged: onSelectionChanged,
            onSelectionAction: onSelectionAction
     })
    {
        this.getChildrenClosure = getChildrenClosure

        this.onSelectionChanged = onSelectionChanged

        this.onSelectionAction = onSelectionAction

        this.columns = []

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.placeholder = '__placeholder__'
    }

    initializeHandles() {
        this.scrolledWindow = new Gtk.ScrolledWindow()
        this.scrolledWindow.setPolicy(
            GtkScroll.auto,
            GtkScroll.auto
        )

        this.treeStore = new Gtk.TreeStore()

        this.treeView = null
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat(
                [
                    'columns',
                    'showHeaders', 'clickableHeaders',
                    'hScroll', 'vScroll',
                ]
            )
        })
    }

    getMainHandle() {
        return this.scrolledWindow
    }

    setColumns(columns) {
        this.addColumns(columns)
    }

    addColumns(columns) {
        const listStoreTypes = columns.map( (column) => {
            return GtkTypes[ column.getType() ]
        })

        this.treeStore.setColumnTypes(listStoreTypes)

        this.treeView = new Gtk.TreeView({model: this.treeStore})

        columns.forEach( (eachColumn) => {
            this.addColumn(eachColumn)
        })

        this.scrolledWindow.add(this.treeView)

        this.subscribeToGUISignals()
    }

    addColumn(column) {
        this.columns.push(column)

        const columnIndex = this.treeView.getColumns().length

        let col = new Gtk.TreeViewColumn({ title: column.getLabel() })

        if( column.isImage() ) {

            const renderer = new Gtk.CellRendererPixbuf()

            col.packStart(renderer, true)

            col.addAttribute(renderer, 'pixbuf', columnIndex)

            this.treeView.appendColumn(col)

        } else {

            const renderer = new Gtk.CellRendererText()

            col.packStart(renderer, true)

            col.addAttribute(renderer, 'text', columnIndex)

            this.treeView.appendColumn(col)

        }
    }

    setHScroll(value) {
        const [hScroll, vScroll] = this.scrolledWindow.getPolicy()

        this.scrolledWindow.setPolicy(
            GtkScroll[ value ],
            vScroll
        )
    }

    setVScroll(value) {
        const [hScroll, vScroll] = this.scrolledWindow.getPolicy()

        this.scrolledWindow.setPolicy(
            hScroll,
            GtkScroll[ value ]
        )        
    }

    /// Accessing

    getChildrenAt({path: path}) {
        return this.getChildrenClosure(path)
    }

    /// Querying

    /*
     * Returns an array with the text of each row in the list.
     * This method is intended only for testing and debugging.
     */
    getRows() {
        const rows = []

        let [hasNext, iter] = this.treeStore.getIterFirst()

        while(hasNext) {
            const rowText = this.treeStore.getValue(iter, 0).getString()

            rows.push(rowText)

            hasNext = this.treeStore.iterNext(iter)
        }

        return rows
    }

    getSelectionIndices() {
        const selectionPaths = []

        const [iterPaths, model] = this.treeView.getSelection().getSelectedRows()

        iterPaths.forEach( (iterPath) => {
            const pathIndices = this.pathStringToPathIndices(iterPath)

            selectionPaths.push(pathIndices)
        })

        return selectionPaths
    }

    setSingleSelection({ indexPath: singleIndexPath }) {
        const multipleIindicesPaths = singleIndexPath.length === 0 ? [] : [singleIndexPath]

        this.setMultipleSelection({ indexPaths: multipleIindicesPaths })
    }

    setMultipleSelection({ indexPaths: indexPaths }) {
        if( indexPaths.length === 0 ) {
            this.treeView.getSelection().unselectAll()
            return
        }

        const iterPaths = indexPaths.map( (indexPath) => {
            return this.treePathFromIndicesArray({ indexPath: indexPath })
        })

        iterPaths.forEach( (iterPath, i) => {
            this.treeView.expandToPath( iterPath )

            const selection = this.treeView.getSelection()

            selection.selectPath(iterPath)
        })

        this.treeView.scrollToCell(iterPaths[0], null, false, 0.0, 0.0)
    }

    treePathFromIndicesArray({ indexPath: indexPath }) {
        const pathString = indexPath.join(':')

        return new Gtk.TreePath.newFromString(pathString)
    }

    /// Actions

    clearItems() {
        this.treeStore.clear()
    }

    setRoots({ items: roots }) {
        this.clearItems()

        this.addItems({
            items: roots,
            parentIter: null,
            index: 0
        })
    }


    addItems(
        {items: items, parentIter: parentIter, index: index}
        =
        {items: items, parentIter: null, index: 0}
    ) {
        items.forEach( (eachItem, i) => {
            this.addItem({
                item: eachItem,
                parentIter: parentIter,
                index: index + i
            })
        })
    }

    addItem({item: item, parentIter: parentIter, index: index}) {
        const iter = this.treeStore.insert(parentIter, index)

        this.setItemColumnValues({ item: item, iter: iter })

        let indicesPath = []

        if(parentIter !== null) {
            indicesPath = this.pathStringToPathIndices(
                this.treeStore.getStringFromIter(parentIter)
            )
        }

        indicesPath.push(index)

        const childrenCount = this.getChildrenAt({ path: indicesPath }).length

        if( childrenCount > 0 ) {
            const placeholderIter = this.treeStore.insert(iter, 0)

            if(this.columns.length == 1) {
                this.setIterText(this.placeholder, placeholderIter, 0)
            } else {
                this.setIterText(this.placeholder, placeholderIter, 1)
            }
        }
    }

    setItemColumnValues({ item: item, iter: iter }) {
        this.columns.forEach( (column, columnIndex) => {

            if( column.isImage() ) {
                const imageFile = column.getImageFileOf({
                    item: item,
                    onUndefined: () => {
                        throw new Error(`The image file for ${item.toString()} is undefined. Is the return statement present in the getImageClosure of the column-${columnIndex}?`)
                    }
                })

                const pixbuf = GtkImage.pixbufAt({
                        filename: imageFile,
                        width: column.getImageWidth(),
                        height: column.getImageHeight()
                    })

                this.setIterImage(pixbuf, iter, columnIndex)

            } else {
                const text = column.getDisplayTextOf({
                    item: item,
                    onUndefined: () => {
                        throw new Error(`The display text for ${item.toString()} is undefined. Is the return statement present in the getTextClosure of the column-${columnIndex}?`)
                    }
                })

                this.setIterText(text, iter, columnIndex)
            }
        })
    }

    setIterText(text, iter, columnIndex = 0) {
        const gtkType = GtkTypes['string']

        const value = new GObject.Value()

        value.init(gtkType)

        value.setString(text)

        this.treeStore.setValue(iter, columnIndex, value)
    }

    setIterImage(pixbuf, iter, columnIndex = 0) {
        const gtkType = GtkTypes['image']

        const value = new GObject.Value()

        value.init(gtkType)

        value.setObject(pixbuf)

        this.treeStore.setValue(iter, columnIndex, value)
    }

    expandNodeAtIndex({ indexPath: indexPath }) {
        const treePath = this.treePathFromIndicesArray({ indexPath: indexPath })

        this.treeView.expandToPath( treePath )
    }

    /// Events

    subscribeToGUISignals() {
        if( this.treeView === null ) { return }

        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'changed',
            from: this.treeView.getSelection(),
            do: this.handleSelectedRowChanged,
            with: this,
        })

        eventsSubscriptor.on({
            event: 'row-activated',
            from: this.treeView,
            do: this.handleSelectionActioned,
            with: this,
        })

        eventsSubscriptor.on({
            event: 'row-expanded',
            from: this.treeView,
            do: this.handleRowExpanded,
            with: this,
        })

        eventsSubscriptor.on({
            event: 'button-press-event',
            from: this.treeView,
            do: this.handleButtonPressed,
            with: this,
        })
    }

    handleButtonPressed(event) {
        if (event.button !== 3) return

        this.showPopupMenu()
    }

    handleSelectedRowChanged() {
        if(this.onSelectionChanged === undefined) {
            return
        }

        this.onSelectionChanged()
    }

    handleSelectionActioned(treePath, treeViewColumn) {
        const selectedIndices = this.pathStringToPathIndices(treePath)

        this.onSelectionAction(selectedIndices)
    }

    /*
     * To emulate a virtual tree, elements are added with a child placeholder, the class constant
     * placeholder().
     * The first time a node is expanded if it has the child placeholder then the placeholder is
     * replaced with the actual node children.
     * The actual children are get using the getChildrenClosure.
     */
    handleRowExpanded(iter, treePath) {
        const [bool, childIter] = this.treeStore.iterNthChild(iter, 0)

        let childValue

        if( this.columns.length === 1 ) {
            childValue = this.treeStore.getValue(childIter, 0).getString()
        } else {
            childValue = this.treeStore.getValue(childIter, 1).getString()
        }

        if( childValue !== this.placeholder ) {
            return
        }

        const indicesPath = this.pathStringToPathIndices(treePath)

        const children = this.getChildrenAt({ path: indicesPath })

        this.treeStore.remove(childIter)

        this.addItems({items: children, parentIter: iter, index: 0})

        this.treeView.expandRow(treePath, false)
    }

    pathStringToPathIndices(path) {
        return path.toString().split(':')
            .map((i) => { return parseInt(i) })
    }

    /// Styles

    setShowHeaders(boolean) {
        this.treeView.setHeadersVisible(boolean)
    }

    getShowHeaders() {
        return this.treeView.getHeadersVisible()
    }

    setClickableHeaders(boolean) {
        this.treeView.setHeadersClickable(boolean)
    }

    getClickableHeaders() {
        return this.treeView.getHeadersClickable()
    }

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(TreeView)
