const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

namespace.useGtkViews()

const selectedFilename = namespace.ConfirmationDialog.new({
        confirmationText: 'Do you want to confirm?',
        confirmLabel: 'Yes',
        rejectLabel: 'No',
    }).open()

console.info(selectedFilename)