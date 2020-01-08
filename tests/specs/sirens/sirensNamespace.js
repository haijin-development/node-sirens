const Sirens = require('../../../src/Sirens')
const TestViewsNamespace = require('./TestViewsNamespace')

const namespace = Sirens.namespace()

/*
    Implementation(`
        During the tests of Sirens we assume no particular GUI library.

        Changing Skins.Views namespace flow ensures that not GtkView is created
        during the tests of Sirens.

        This is also an example of how to use the Namespace as a Factory pattern to
        change from the default GtkViews library to a different one.
    `)
*/
namespace.getChildFlow({ id: 'Skins' }).replaceChildFlow({
    id: 'Views',
    withFlow: TestViewsNamespace.new(),
})


module.exports = namespace