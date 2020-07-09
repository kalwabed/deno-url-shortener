import { Application } from 'https://deno.land/x/oak/mod.ts'
import {
    viewEngine,
    engineFactory,
    adapterFactory,
} from 'https://deno.land/x/view_engine/mod.ts'

import router from './routes.ts'

const app: Application = new Application()
const port = 5000

// engine view
const ejsEngine = engineFactory.getEjsEngine()
const oakAdapter = adapterFactory.getOakAdapter()
const viewConfig = { viewRoot: './views', viewExt: '.ejs' }
app.use(viewEngine(oakAdapter, ejsEngine, viewConfig))

app.use(router.allowedMethods())
app.use(router.routes())

console.log(`App running on ${port}`)
await app.listen({ port })
