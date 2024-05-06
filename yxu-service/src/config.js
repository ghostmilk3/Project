import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import merge from 'lodash/merge.js'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))

const getProcessEnvValue = function (name) {
  if (!process.env[name]) {
    throw new Error(`You must set the ${name} environment variable`)
  }
  return process.env[name]
}

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: 8080,
    ip: process.env.IP || 'localhost',
    apiRoot: process.env.API_ROOT || '',
    defaultEmail: 'no-reply@yxu-service.com',
    sendgridKey: getProcessEnvValue('SENDGRID_KEY'),
    masterKey: getProcessEnvValue('MASTER_KEY'),
    jwtSecret: getProcessEnvValue('JWT_SECRET'),
    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
    }
  },
  test: { },
  development: {
    mongo: {
      uri: process.env.MONGODB_URI,
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI
    }
  }
}

export default merge(config.all, config[config.all.env])