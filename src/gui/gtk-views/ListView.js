const nodeGtk = require('node-gtk')
const Gtk = nodeGtk.require('Gtk', '3.0')
const GObject = nodeGtk.require('GObject')
const GtkTypes = require('./constants/GtkTypes')
const GtkScroll = require('./constants/GtkScroll')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImage = require('./GtkImage')

class ListView {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'scrolledWindow', 'listStore', 'treeView', 'columns',
            'onSelectionChanged', 'onSelectionAction',
            'allowSelectionChange',
            'hasScrollBars',
        ]
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat(
                [
                    'showHeaders', 'clickableHeaders',
                    'columns',
                    'hScroll', 'vScroll',
                ]
            )
        })
    }

    /// Initializing

    initialize({
            onSelectionChanged: onSelectionChanged,
            onSelectionAction: onSelectionAction,
            allowSelectionChange: allowSelectionChange,
            hasScrollBars: hasScrollBars,
        })
    {
        if( hasScrollBars === undefined ) { hasScrollBars = true }

        this.hasScrollBars = hasScrollBars

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.onSelectionChanged = onSelectionChanged

        this.onSelectionAction = onSelectionAction

        this.allowSelectionChange = allowSelectionChange

        this.columns = []
    }

    initializeHandles() {
        if( this.hasScrollBars ) {

            this.scrolledWindow = new Gtk.ScrolledWindow()
            this.scrolledWindow.setPolicy(
                GtkScroll.auto,
                GtkScroll.auto
            )

        }

        this.listStore = new Gtk.ListStore()
        this.treeView = null
    }

    setColumns(columns) {
        this.addColumns(columns)

        this.subscribeToGUISignals()
    }

    addColumns(columns) {
        const listStoreTypes = columns.map( (column) => {
            return GtkTypes[ column.getType() ]
        })

        this.listStore.setColumnTypes(listStoreTypes)

        this.treeView = new Gtk.TreeView({ model: this.listStore })

        this.treeView.getSelection().setSelectFunction( this.onSelectFunction.bind(this) )

        columns.forEach( (eachColumn) => {
            this.addColumn(eachColumn)
        })

        if( this.hasScrollBars ) {
            this.scrolledWindow.add( this.treeView )
        }
    }

    addColumn(column) {
        this.columns.push(column)

        const columnIndex = this.treeView.getColumns().length

        let col = new Gtk.TreeViewColumn({ title: column.getLabel() })

        if( column.isImage() ) {

            const renderer = new Gtk.CellRendererPixbuf()

            col.packStart(renderer, true)

            col.addAttribute(renderer, 'pixbuf', columnIndex)

        } else {

            const renderer = new Gtk.CellRendererText()

            col.packStart(renderer, true)

            col.addAttribute(renderer, 'text', columnIndex)

            this.treeView.appendColumn(col)

        }

        this.treeView.appendColumn(col)
    }

    /// Querying

    getMainHandle() {
        if( this.hasScrollBars ) {
            return this.scrolledWindow
        } else {
            return this.treeView
        }
    }

    /*
     * Returns an array with the text of each row in the list.
     * This method is intended only for testing and debugging.
     */
    getRows() {
        const rows = []

        let [hasNext, iter] = this.listStore.getIterFirst()

        while(hasNext) {
            const rowText = this.listStore.getValue(iter, 0).getString()

            rows.push(rowText)

            hasNext = this.listStore.iterNext(iter)
        }

        return rows
    }

    getSelectionIndices() {
        const indices = []

        const [paths, model] = this.treeView.getSelection().getSelectedRows()

        paths.forEach( (path) => {
            indices.push( parseInt(path.toString()) )
        })

        return indices
    }

    /// Actions

    clearItems() {
        this.listStore.clear()
    }

    setSelectionIndices(indices) {
        if(indices.length === 0) {
            this.treeView.getSelection().unselectAll()
            return
        }

        const iterPaths = indices.map( (rowIndex) => {
            return Gtk.TreePath.newFromIndices([rowIndex])
        })

        iterPaths.forEach( (iterPath) => {
            this.treeView.getSelection().selectPath(iterPath)
        })

        this.treeView.scrollToCell(iterPaths[0], null, false, 0.0, 0.0)
    }

    addItems(items, index) {
        if(index === undefined) {
            index = this.listStore.iterNChildren(null)
        }

        items.forEach( (each, i) => {
            this.addItem(each, index + i)
        })
    }

    addItem(item, index) {
        let iter = null

        if(index === undefined) {
            iter = this.listStore.append()
        } else {
            iter = this.listStore.insert(index)
        }

        this.setItemColumnValues({ item: item, iter: iter })
    }

    updateItems({items: items, indices: indices}) {
        items.forEach( (each, i) => {
            this.updateItem(each, indices[i])
        })
    }

    updateItem(item, index) {
        const [bool, iter] = this.listStore.iterNthChild(null, index)

        if(bool === false) {
            throw new Error `The index ${index} is out of range.`
        }

        this.setItemColumnValues({ item: item, iter: iter })
    }

    removeItems({items: items, indices: indices}) {
        items.forEach( (each, i) => {
            this.removeItem(each, indices[i])
        })
    }

    removeItem(item, index) {
        const [bool, iter] = this.listStore.iterNthChild(null, index)

        if(bool === false) {
            throw new Error `The index ${index} is out of range.`
        }

        this.listStore.remove(iter)
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

        this.listStore.setValue(iter, columnIndex, value)
    }

    setIterImage(pixbuf, iter, columnIndex = 0) {
        const gtkType = GtkTypes['image']

        const value = new GObject.Value()

        value.init(gtkType)

        value.setObject(pixbuf)

        this.listStore.setValue(iter, columnIndex, value)
    }

    /// Events

    subscribeToGUISignals() {
        if(this.treeView === null) {
            return
        }

        this.treeView.getSelection().on('changed', this.handleSelectedRowChanged.bind(this))

        this.treeView.on('row-activated', this.handleSelectionActioned.bind(this))

        this.treeView.on('button-press-event', this.handleButtonPressed.bind(this))
    }

    handleSelectedRowChanged() {
        if(this.onSelectionChanged === undefined) {
            return
        }

        this.onSelectionChanged()
    }

    handleSelectionActioned(treePath, treeViewColumn) {
        if(this.onSelectionAction === undefined) {
            return
        }

        const selectedIndices = this.getSelectionIndices()

        this.onSelectionAction(selectedIndices)
    }

    handleButtonPressed(event) {
        if (event.button !== 3) return

        this.showPopupMenu()
    }

    /*
     * Note: returning false does not disallow changing the selection.
     * Leave it as an error for now.
     */
    onSelectFunction(treeSelection, treeModel, treePath, pathCurrentlySelected) {
        if( this.allowSelectionChange === undefined ) {
            return true
        }

        const selectedIndices = this.getSelectionIndices()

        const allowed = this.allowSelectionChange({ selectedIndices: selectedIndices })

        return allowed
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
}

module.exports = Classification.define(ListView)