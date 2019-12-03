const Classification = require('../../O').Classification
const Flow = require('./Flow')
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
        roots: roots, getChildrenClosure: getChildrenClosure, id: id, idPath: idPath,
    }) {
        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })

        this.roots = roots
        this.getChildrenClosure = getChildrenClosure
    }

    asFlowPoint() {
        const flowPoint = TreeChoiceFlowPoint.new({ flow: this })

        this.on('selection-changed', flowPoint.onFlowSelectionChanged.bind(flowPoint) )
        this.on('roots-changed', flowPoint.onFlowRootsChanged.bind(flowPoint) )

        return flowPoint
    }

    /// Values

    getRoots() {
        return this.roots
    }

    setRoots({ items: items }) {
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

        if( selectionPath === null || selectionPath.length === 0 ) {
            return null
        }

        const lastItemInSelectionPath = selectionPath[ selectionPath.length - 1 ]

        return lastItemInSelectionPath
    }

    updateRoots({ items: items }) {
        const oldRoots = items

        this.roots = items

        if( this.hasWhenRootsChangesClosure() ) {

            this.evaluateWhenRootsChangesClosure({
                newRoots: items,
                oldRoots: oldRoots,
            })

        }

        this.emit('roots-changed', { newRoots: items, oldRoots: oldRoots })
    }

    updateSelection(itemPath) {
        const oldSelection = this.selection

        this.selection = itemPath

        if( this.hasWhenSelectionChangesHandler() ) {

            this.evaluateWhenSelectionChangesHandler({
                newValue: this.selection,
                oldValue: oldSelection,
            })

        }

        this.emit('selection-changed', { newValue: itemPath, oldValue: oldSelection })
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