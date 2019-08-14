const OInstance = require('./OInstance')
const {lookupPropIn} = require('./implementation/props-lookup')

function getProp(receiver, prop) {
    return lookupPropIn(this, receiver, prop)
}

function setProp(target, prop, value, receiver) {
    target[prop] = value

    return target
}

function createProxyOn(object) {
    const handler = {
        get: getProp,
        set: setProp,
    }

    const proxy = new Proxy(object, handler)

    handler.get = handler.get.bind(proxy)
    handler.set = handler.set.bind(proxy)

    return proxy

}

const O = Object.create(null)

/*
 * Creates a new O instance with a OInstance already added.
 *
 * Use
 *
 *      const object = O.new()
 *
 * instead of
 *
 *      const object = new O()
 *
 * to avoid the created object to have a default prototype since the O language sets the whole
 * prototype chain.
 */
O.new = function Instance() {

    const object = Object.create(null)

    object.classifications = []

    const oClassification = new OInstance()

    oClassification.sourceClassification = OInstance

    object.classifications.unshift(oClassification)

    return createProxyOn(object)
}

module.exports = O