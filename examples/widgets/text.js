const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')

class CustomComponent extends Component{
    /// Building

    renderWith(builder) {
        builder.render(function (component) {
            this.window( () => {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.text({value: 'A text'})
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})