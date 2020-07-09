import { Router } from 'https://deno.land/x/oak/mod.ts'
import { multiParser } from 'https://raw.githubusercontent.com/deligenius/multiparser/master/mod.ts'
import shortUnique from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts'

import DB from './database.ts'
import { dbUrl } from './types.ts'
const UUID = new shortUnique({ dictionary: ['kaliwa'] })

const router: Router = new Router()

router.get('/', async ctx => {
    const data = await DB.find()
    ctx.render('index', { data })
})
router.post('/post', async ctx => {
    const formData: any = await multiParser(ctx.request.serverRequest)
    console.log(formData)
    const data = { fullUrl: formData.url, shortUrl: UUID(), click: 0 }
    await DB.insertOne(data)

    ctx.response.redirect('/')
})
router.get('/:id', async ctx => {
    try {
        const shortFrom = await ctx.params.id
        const isUrl: dbUrl = await DB.findOne({ shortUrl: shortFrom })
        if (!isUrl) {
            ctx.response.status = 404
            ctx.response.body = 'Page not found!'
            return
        }
        await DB.updateOne(
            { _id: isUrl._id },
            { $set: { click: isUrl.click + 1 } }
        )
        ctx.response.status = 301
        ctx.response.redirect(`${isUrl.fullUrl}`)
    } catch (err) {
        console.error(err)
    }
})

export default router
