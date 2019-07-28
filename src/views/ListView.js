const View = require('./View')
const nodeGtk = require('node-gtk')
const Gtk = nodeGtk.require('Gtk', '3.0')
const GObject = nodeGtk.require('GObject')
const Types = require('./Types')

class ListView extends View {
    /// Styles

    static acceptedStyles() {
        return super.acceptedStyles().concat(['columns'])
    }

    /// Initializing

    constructor({
                    onSelectionChanged: onSelectionChanged,
                    onSelectionAction: onSelectionAction
                })
    {
        super()

        this.onSelectionChanged = onSelectionChanged

        this.onSelectionAction = onSelectionAction
    }

    initializeHandles() {
        this.mainHandle = new Gtk.ScrolledWindow()
        this.mainHandle.setPolicy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)

        this.listStore = new Gtk.ListStore()
        this.treeView = null

        this.columns = []
    }

    setColumns(columns) {
        this.addColumns(columns)

        this.subscribeToGUISignals()
    }

    addColumns(columns) {
        const listStoreTypes = columns.map( (column) => {
            return this.getColumnType(column.getType())
        })

        this.listStore.setColumnTypes(listStoreTypes)

        this.treeView = new Gtk.TreeView({model: this.listStore})

        columns.forEach( (eachColumn) => {
            this.addColumn(eachColumn)
        })

        this.mainHandle.add(this.treeView)
    }

    addColumn(column) {
        this.columns.push(column)

        const columnIndex = this.treeView.getColumns().length

        const col = new Gtk.TreeViewColumn({title: column.getLabel()})

        const renderer = new Gtk.CellRendererText()

        col.packStart(renderer, true)
        col.addAttribute(renderer, 'text', columnIndex)

        this.treeView.appendColumn(col)
    }

    getColumnType(type) {
        return Types[type]
    }

    /// Querying

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

        this.setItemColumnValues({item: item, iter: iter})
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

        this.setItemColumnValues({item: item, iter: iter})
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

    setItemColumnValues({item: item, iter: iter}) {
        this.columns.forEach( (column, columnIndex) => {
            const text = column.getDisplayTextOf(item)

            if(text === undefined) {
                throw new Error `The display text for ${item} is undefined. Is the return statement present in the getTextBlock of the column-${columnIndex}?`
            }

            const gtkType = Types['string']

            const value = new GObject.Value()

            value.init(gtkType)

            value.setString(text)

            this.listStore.setValue(iter, columnIndex, value)
        })
    }

    /// Events

    subscribeToGUISignals() {
        if(this.treeView === null) {
            return
        }

        this.treeView.getSelection().on('changed', this.onSelectedRowChanged.bind(this))

        this.treeView.on('row-activated', this.onSelectionActioned.bind(this))
    }

    onSelectedRowChanged() {
        if(this.onSelectionChanged === undefined) {
            return
        }

        this.onSelectionChanged()
    }

    onSelectionActioned(treePath, treeViewColumn) {
        if(this.onSelectionAction === undefined) {
            return
        }

        const selectedIndices = this.getSelectionIndices()

        this.onSelectionAction(selectedIndices)
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
}

module.exports = ListView