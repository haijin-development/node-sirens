const View = require('./View')
const nodeGtk = require('node-gtk')
const Gtk = nodeGtk.require('Gtk', '3.0')
const GObject = nodeGtk.require('GObject')
const Types = require('./Types')

class TreeView extends View {
    /// Styles

    static acceptedStyles() {
        return super.acceptedStyles().concat(
            [
                'columns', 'showHeaders', 'clickableHeaders',
                'onSelectedValueChanged', 'onSelectionAction',
            ]
        )
    }

    static placeholder() {
        if(this._placeholder === undefined) {
            this._placeholder = '__placeholder__'
        }

        return this._placeholder
    }

    /// Initializing

    constructor({
            getChildrenBlock: getChildrenBlock,
            onSelectionChanged: onSelectionChanged,
            onSelectionAction: onSelectionAction
     })
    {
        super()

        this.getChildrenBlock = getChildrenBlock

        this.onSelectionChanged = onSelectionChanged

        this.onSelectionAction = onSelectionAction
    }

    initializeHandles() {
        this.treeStore = new Gtk.TreeStore()

        this.treeView = null

        this.mainHandle = new Gtk.ScrolledWindow()
        this.mainHandle.setPolicy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)

        this.columns = []
    }

    setColumns(columns) {
        this.addColumns(columns)
    }

    addColumns(columns) {
        const listStoreTypes = columns.map( (column) => {
            return this.getColumnType(column.type)
        })

        this.treeStore.setColumnTypes(listStoreTypes)

        this.treeView = new Gtk.TreeView({model: this.treeStore})

        columns.forEach( (eachColumn) => {
            this.addColumn(eachColumn)
        })

        this.mainHandle.add(this.treeView)

        this.subscribeToGUISignals()
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
        if(type === undefined) {
            type = 'string'
        }

        return Types[type]
    }

    /// Accessing

    getChildrenAt({path: path}) {
        return this.getChildrenBlock(path)
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

    setSelectionIndices(indices) {
        if( indices.length === 0) {
            this.treeView.getSelection().unselectAll()
            return
        }

        const iterPaths = indices.map( (path) => {
            const pathString = path.join(':')

            return new Gtk.TreePath.newFromString(pathString)
        })

        iterPaths.forEach( (iterPath, i) => {
            if(indices[i].length > 1) {
                const allIndicesButLast = indices[i].slice(0, indices[i].length-2)

                //this.expand({ path: allIndicesButLast })
            }

            this.treeView.getSelection().selectPath(iterPath)
        })

        this.treeView.scrollToCell(iterPaths[0], null, false, 0.0, 0.0)
    }

    /// Actions

    clearItems() {
        this.treeStore.clear()
    }

    setRoots(roots) {
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

        this.setItemColumnValues({item: item, iter: iter})

        let indicesPath = []

        if(parentIter !== null) {
            indicesPath = this.pathStringToPathIndices(
                this.treeStore.getStringFromIter(parentIter)
            )
        }

        indicesPath.push(index)

        const childrenCount = this.getChildrenAt({path: indicesPath}).length

        if( childrenCount > 0 ) {
            const placeholderText = this.constructor.placeholder()

            const placeholder = this.treeStore.insert(iter, 0)

            this.setIterText(placeholderText, placeholder)
        }
    }

    setItemColumnValues({item: item, iter: iter}) {
        this.columns.forEach( (column, columnIndex) => {
            const text = column.getDisplayTextOf(item)

            if(text === undefined) {
                throwError `The display text for ${item} is undefined. Is the return statement present in the getTextBlock of the column-${columnIndex}?`
            }

            this.setIterText(text, iter, columnIndex)
        })
    }

    setIterText(text, iter, columnIndex = 0) {
        const gtkType = Types['string']

        const value = new GObject.Value()

        value.init(gtkType)

        value.setString(text)

        this.treeStore.setValue(iter, columnIndex, value)
    }

    /// Events

    subscribeToGUISignals() {
        if(this.treeView === null) {
            return
        }

        this.treeView.getSelection().on('changed', this.onSelectedRowChanged.bind(this))

        this.treeView.on('row-activated', this.onSelectionActioned.bind(this))

        this.treeView.on('row-expanded', this.onRowExpanded.bind(this))

        this.treeView.on('button-press-event', this.onButtonPressed.bind(this))
    }

    onButtonPressed(event) {
        if (event.button !== 3) return

        this.showPopupMenu()
    }

    onSelectedRowChanged() {
        if(this.onSelectionChanged === undefined) {
            return
        }

        this.onSelectionChanged()
    }

    onSelectionActioned(treePath, treeViewColumn) {
        const selectedIndices = this.pathStringToPathIndices(treePath)

        this.onSelectionAction(selectedIndices)
    }

    /*
     * To emulate a virtual tree, elements are added with a child placeholder, the class constant
     * placeholder().
     * The first time a node is expanded if it has the child placeholder then the placeholder is
     * replaced with the actual node children.
     * The actual children are get using the getChildrenBlock.
     */
    onRowExpanded(iter, treePath) {
        const [bool, childIter] = this.treeStore.iterNthChild(iter, 0)

        const childValue = this.treeStore.getValue(childIter, 0).getString()

        if( childValue != this.constructor.placeholder() ) {
            return
        }

        const indicesPath = this.pathStringToPathIndices(treePath)

        const children = this.getChildrenAt({path: indicesPath})

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
}

module.exports = TreeView