const path = require('path')
const fs = require('fs')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImageBuilder = require('./constants/GtkImageBuilder')

class ImageView {
    /// Definition

    static definition() {
        this.instanceVariables = ['image', 'imageProps']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ imageProps: imageProps }) {
        this.imageProps = imageProps

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.image = GtkImageBuilder.build( this.imageProps )
    }

    /// Accessing

    getMainHandle() {
        return this.image
    }

    /// Events

    subscribeToGUISignals() {
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

module.exports = Classification.define(ImageView)