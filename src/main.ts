import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {PiniaColada} from '@pinia/colada'
import {PiniaColadaRetry} from '@pinia/colada-plugin-retry'
import VueApexCharts from 'vue3-apexcharts'
import {PiniaColadaAutoRefetch} from '@pinia/colada-plugin-auto-refetch'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(VueApexCharts)
app.component('apexchart', VueApexCharts)
app.use(PiniaColada, {
    queryOptions: {
        // change the stale time for all queries to 0ms
        staleTime: 0,
    },
    mutationOptions: {
        // add global mutation options here
    },
    plugins: [
        PiniaColadaRetry({
            // Pinia Colada Retry options
        }),
        PiniaColadaAutoRefetch({autoRefetch: true})
    ],
})
app.use(ui)
app.use(router)
app.mount('#app')
