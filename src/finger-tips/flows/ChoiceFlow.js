const Classification = require('../../O').Classification
const Flow = require('./Flow')
const ChoiceFlowPoint = require('./ChoiceFlowPoint')
const Announcer = require('../announcements/Announcer')

class ChoiceFlow {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'choices', 'selection',
            'whenChoicesChangesClosure',
            'whenSelectionChangesClosure',
        ]
        this.assumes = [Flow, Announcer]
    }

    /// Initializing

    afterInstantiation() {
        this.choices = []
        this.selection = null
    }

    initialize({
        choices: choices, id: id, idPath: idPath,
    }) {
        this.previousClassificationDo( () => {
            this.initialize({ id: id, idPath: idPath })
        })

        this.choices = choices
    }

    asFlowPoint() {
        const flowPoint = ChoiceFlowPoint.new({ flow: this })

        this.on('selection-changed', flowPoint.onFlowSelectionChanged.bind(flowPoint) )
        this.on('choices-changed', flowPoint.onFlowChoicesChanged.bind(flowPoint) )

        return flowPoint
    }

    /// Values

    getChoices() {
        return this.choices
    }

    setChoices(choices) {
        this.evaluateEventHandler({
            event: 'setChoices',
            params: [choices],
            eventHandler: () => {
                this.updateChoices(choices)
            }
        })

        return this
    }

    setSelection(item) {
        this.evaluateEventHandler({
            event: 'setSelection',
            params: [item],
            eventHandler: () => {
                this.updateSelection(item)
            }
        })

        return this
    }

    setSelectionIndex({ index: index }) {
        let item = this.choices[index]

        if( item === undefined ) { item = null }

        this.setSelection( item )

        return this
    }

    setSelectionSuchThat({ matches: matchingClosure }) {
        let matchingItem = this.choices.find( matchingClosure )

        if( matchingItem === undefined ) { matchingItem = null }

        this.setSelection( matchingItem )
    }

    getSelection() {
        return this.selection
    }

    updateChoices(choices) {
        const oldChoices = this.choices

        this.choices = choices

        if( this.hasWhenChoicesChangesClosure() ) {
            this.evaluateWhenChoicesChangesClosure({
                oldChoices: oldChoices,
                newChoices: choices,
            })
        }

        this.emit('choices-changed', { newList: choices, oldList: oldChoices })
    }

    updateSelection(item) {
        const oldSelection = this.selection

        this.selection = item

        if( this.hasWhenSelectionChangesHandler() ) {

            this.evaluateWhenSelectionChangesClosure({
                newValue: item,
                oldValue: oldSelection,
            })

        }

        this.emit('selection-changed', { newValue: item, oldValue: oldSelection })
    }

    // Events

    setWhenChoicesChangesClosure(whenChoicesChangesClosure) {
        this.whenChoicesChangesClosure = whenChoicesChangesClosure
    }

    hasWhenChoicesChangesClosure() {
        return this.whenChoicesChangesClosure
    }

    evaluateWhenChoicesChangesClosure({ oldChoices: oldChoices, newChoices: newChoices }) {
        this.whenChoicesChangesClosure({
            oldChoices: oldChoices,
            newChoices: newChoices
        })
    }

    setWhenSelectionChangesClosure(whenSelectionChangesClosure) {
        this.whenSelectionChangesClosure = whenSelectionChangesClosure
    }

    hasWhenSelectionChangesHandler() {
        return this.whenSelectionChangesClosure !== undefined
    }

    evaluateWhenSelectionChangesClosure({ newValue: newValue, oldValue: oldValue }) {
        this.whenSelectionChangesClosure({ newValue: newValue, oldValue: oldValue })
    }
}

module.exports = Classification.define(ChoiceFlow)