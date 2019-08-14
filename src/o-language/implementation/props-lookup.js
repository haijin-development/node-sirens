const activeClassificationsStack = []

function activateMethod(proxy, receiver, method, classification, ...params) {
    activeClassificationsStack.push(classification)

    try {
        return method.call(proxy, ...params)
    } finally {
        activeClassificationsStack.pop()
    }
}

function findPropInClassification(classification, methodName) {
    const prototype = Object.getPrototypeOf(classification)

    return prototype[methodName]
}

function findMethodAmongAllClassificationsOf(proxy, receiver, methodName) {
    for(const eachClassification of receiver.classifications) {
        const prop = findPropInClassification(eachClassification, methodName)

        if( prop !== undefined ) {
            if( typeof prop !== 'function' ) {
                return prop
            }

            const f = function(...params) {
                return activateMethod(proxy, receiver, prop, eachClassification, ...params)
            }

            return f
        }
    }

    return undefined
}

function findPropInReceiver(proxy, receiver, propName) {
    return receiver[propName]
}

function lookupPropIn(proxy, receiver, propName) {
    const prop = findPropInReceiver(proxy, receiver, propName)

    if( prop != undefined ) {
        return prop
    }

    return findMethodAmongAllClassificationsOf(proxy, receiver, propName)
}

module.exports = {lookupPropIn}