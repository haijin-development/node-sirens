const Sirens = require('../../src/Sirens')

function topMost() {
    const top = {
        value: 1
    }

    middle(top)
}

function middle(top) {
    const middle = {
        value: 2
    }

    bottomMost(top, middle)
}

function bottomMost(top, middle) {
    const bottom = {
        value: 3
    }

    Sirens.browseStack(arguments)
}

topMost()