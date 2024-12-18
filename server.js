// server.js
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

app.use('/videos/*', serveStatic({ root: './public' }))
app.use('/js/*', serveStatic({ root: './public' }))

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>HLS Demo</title>
      <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
      <script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>
    </head>
    <body>
      <h1>HLS Streaming Demo</h1>
      <video-js id="player" class="vjs-default-skin" controls width="640" height="360">
        <source src="/videos/playlist.m3u8" type="application/x-mpegURL">
      </video-js>
      <script src="/js/player.js"></script>
    </body>
    </html>
  `)
})

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('Server running at http://localhost:3000')