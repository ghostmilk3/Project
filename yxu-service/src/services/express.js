import express from 'express'
import cookieParser from 'cookie-parser'
import forceSSL from 'express-force-ssl'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import config from '../config.js'

const { env } = config

export default function (apiRoot, routes) {
  const app = express()

  app.use(cookieParser())

  if (env === 'production') {
    app.set('forceSSLOptions', {
      enable301Redirects: false,
      trustXFPHeader: true
    })
    app.use(forceSSL)
  }

  app.use(cors({
    origin: true,
    credentials : true
  }))
  app.use(compression())
  app.use(morgan('dev'))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(apiRoot, routes)

  return app
}
