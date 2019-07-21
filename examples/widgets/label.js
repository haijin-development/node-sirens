const Sirens = require('../../src/index')
const Component = require('../../src/components/Component')

class CustomComponent extends Component{
    /// Building

    renderWith(builder) {
        builder.render(function (component) {
            this.window( () => {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.label({text: 'A text label'})
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})