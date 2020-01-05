const Classification = require('../../O').Classification
const Command = require('./Command')

class CreateObjectCommand {

    /// Definition

    static definition() {
        this.instanceVariables = ['singleton']
        this.assumes = [Command]
    }

    new(...params) {
        const newObject = this.execute({ params: params })

        return newObject
    }

    getSingleton() {
        return this.singleton
    }

    setSingleton(object) {
        this.singleton = object
    }
}

module.exports = Classification.define(CreateObjectCommand)