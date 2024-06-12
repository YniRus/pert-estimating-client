// Styles
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

// Icons
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})
