const Classification = require('../../O').Classification
const Command = require('./Command')

class CreateObjectCommand {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Command]
    }

    new(...params) {
        const newObject = this.execute({ params: params })

        return newObject
    }
}

module.exports = Classification.define(CreateObjectCommand)