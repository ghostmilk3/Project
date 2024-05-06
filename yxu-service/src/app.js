import http from 'http'
import config from './config.js'
import mongoose from './services/mongoose.js'
import express from './services/express.js'
import { api } from './api/index.js'
import { success } from './services/response.js'

const { apiRoot, ip, port, env, mongo } = config
const app = express(apiRoot, api)
const server = http.createServer(app)

app.use(success)

if (mongo.uri) {
  mongoose.connect(mongo.uri)
}

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

export { app }
