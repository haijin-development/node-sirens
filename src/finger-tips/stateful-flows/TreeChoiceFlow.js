const Classification = require('../../O').Classification
const Flow = require('../flows/Flow')
const TreeChoiceFlowPoint = require('./TreeChoiceFlowPoint')
const Announcer = require('../announcements/Announcer')

class TreeChoiceFlow {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'roots', 'selection', 'getChildrenClosure',
            'whenRootsChangesClosure', 'whenSelectionChangesClosure',
        ]
        this.assumes = [Flow, Announcer]
    }

    /// Initializing

    afterInstantiation() {
        this.roots = []
        this.selection = []
    }

    initialize({
        id: id, idPath: idPath,
        roots: roots, getChildrenClosure: getChildrenClosure,
    }) {
        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })

        this.roots = roots
        this.getChildrenClosure = getChildrenClosure
    }

    releaseFlow() {
        this.dropAllAnnouncementsForAllListeners()

        this.previousClassificationDo( () => {
            this.releaseFlow()
        })
    }

    /// Exporting

    asFlowPoint() {
        const flowPoint = TreeChoiceFlowPoint.new({ flow: this })

        this.on('selection-changed', flowPoint.onFlowSelectionChanged.bind(flowPoint) )
        this.on('roots-changed', flowPoint.onFlowRootsChanged.bind(flowPoint) )

        this.attachCommandsToFlowPoint({ flowPoint: flowPoint })

        return flowPoint
    }

    /// Values

    getRoots() {
        return this.roots
    }

    setRoots({ items: items }) {
        if( items === undefined ) { throw new Error(`Missing parameter {items: }.`) }

        this.evaluateEventHandler({
            event: 'setRoots',
            params: [items],
            eventHandler: () => {
                this.updateRoots({ items: items })
            }
        })

        return this
    }

    getGetChildrenClosure() {
        return this.getChildrenClosure
    }

    setSelection(itemPath) {
        if( ! itemPath ) { itemPath = [] }

        this.evaluateEventHandler({
            event: 'setSelection',
            params: [itemPath],
            eventHandler: () => {
                this.updateSelection(itemPath)
            }
        })

        return this
    }

    getSelection() {
        return this.selection
    }

    getSelectionValue() {
        const selectionPath = this.getSelection()

        if( ! selectionPath || selectionPath.length === 0 ) {
            return null
        }

        const lastItemInSelectionPath = selectionPath[ selectionPath.length - 1 ]

        return lastItemInSelectionPath
    }

    getSelectionIndexPath() {
        let nodes = this.roots

        const indexPath = this.getSelection().map( (node) => {
            const index = nodes.indexOf( node )

            nodes = this.getChildrenClosure( node )

            return index
        })

        return indexPath
    }

    setSelectionIndexPath({ indexPath: indexPath }) {
        let nodes = this.roots

        const selectionPath = indexPath.map( (index) => {
            const node = nodes[ index ]

            nodes = this.getChildrenClosure( node )

            return node
        })

        return this.setSelection( selectionPath )
    }

    updateRoots({ items: items }) {
        const oldRoots = this.getRoots()

        if( oldRoots === items ) { return }

        this.roots = items

        if( this.hasWhenRootsChangesClosure() ) {

            this.evaluateWhenRootsChangesClosure({
                newRoots: items,
                oldRoots: oldRoots,
            })

        }

        this.addPendingEvent({
            event: 'roots-changed',
            params:  { newRoots: items, oldRoots: oldRoots },
        })  
    }

    updateSelection(itemPath) {
        const oldSelection = this.selection

        if( oldSelection === itemPath ) { return }

        this.selection = itemPath

        if( this.hasWhenSelectionChangesHandler() ) {

            this.evaluateWhenSelectionChangesHandler({
                newValue: this.selection,
                oldValue: oldSelection,
            })

        }

        this.addPendingEvent({
            event: 'selection-changed',
            params:  { newValue: itemPath, oldValue: oldSelection },
        })  
    }

    // Events

    setWhenRootsChangesClosure(whenRootsChangesClosure) {
        this.whenRootsChangesClosure = whenRootsChangesClosure
    }

    hasWhenRootsChangesClosure() {
        return this.whenRootsChangesClosure
    }

    evaluateWhenRootsChangesClosure({ oldRoots: oldRoots, newRoots: newRoots }) {
        this.whenRootsChangesClosure({
            oldRoots: oldRoots,
            newRoots: newRoots,
        })
    }

    evaluateWhenSelectionChangesHandler({ newValue: newSelection, oldValue: oldSelection }) {
        this.whenSelectionChangesClosure({
            newValue: newSelection,
            oldValue: oldSelection,
        })
    }

    setWhenSelectionChangesClosure(whenSelectionChangesClosure) {
        this.whenSelectionChangesClosure = whenSelectionChangesClosure
    }

    hasWhenSelectionChangesHandler() {
        return this.whenSelectionChangesClosure !== undefined
    }
}

module.exports = Classification.define(TreeChoiceFlow)