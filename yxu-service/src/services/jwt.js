import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
import config from '../config.js'

const jwtSecret = config.jwtSecret
const jwtSign = Promise.promisify(jwt.sign)
const jwtVerify = Promise.promisify(jwt.verify)

export const sign = function (id, options, method = jwtSign) {
  return method({ id }, jwtSecret, options)
}

export const signSync = function (id, options) {
  return sign(id, options, jwt.sign)
}

export const verify = function (token) {
  return jwtVerify(token, jwtSecret)
}
