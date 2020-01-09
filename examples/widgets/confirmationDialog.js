const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

namespace.useGtkViews()

const selectedFilename = namespace.ConfirmationDialog.new({
        confirmationText: 'Do you want to confirm? 1234567890',
        confirmLabel: 'Yes',
        rejectLabel: 'No',
    }).open()

console.info(selectedFilename)