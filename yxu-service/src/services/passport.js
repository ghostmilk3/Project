import passport from 'passport'
import passportHttp from 'passport-http'
import passportHttpBearer from 'passport-http-bearer'
import passportJwt from 'passport-jwt'
import config from '../config.js'
import User from '../api/user/model.js'
import { error } from './response.js'

const { jwtSecret, masterKey } = config
const BasicStrategy = passportHttp.BasicStrategy
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy
const BearerStrategy = passportHttpBearer.Strategy

export const password = function () {
  return function (req, res, next) {
    let tenant = req.headers.tenant
    if (!tenant) {
      error(res, 400, 'Please provide tenant information in the request headers.')
    } else {
      passport.authenticate('password', { session: false }, (err, { givenEmail, givenPassword }) => {
        User.byTenant(tenant)
          .findOne({ email: givenEmail })
          .then(user => {
            if (!user) {
              error(res, 401, 'The given email or password are not valid.')
              return
            }
            user.authenticate(givenPassword, user.password).then(authenticatedUser => {
              if (authenticatedUser) {
                req.logIn(authenticatedUser, { session: false }, logInErr => {
                  if (logInErr) {
                    error(res, 500, 'Internal server error! Please try again later.')
                  }
                  next()
                })
              } else {
                error(res, 401, 'The given email or password are not valid.')
              }
            })
          })
      })(req, res, next)
    }
  }
}

export const master = function () {
  return function (req, res, next) {
    passport.authenticate('master', { session: false }, (err, result) => {
      if (!result) {
        error(res, 401, 'The given master key is not valid.')
        return
      }
      next()
    })(req, res, next)
  }
}

export const token = function (roles = User.roles) {
  return function (req, res, next) {
    passport.authenticate('token', { session: false }, (err, user) => {
      if (err || !user || !roles.includes(user.role)) {
        error(res, 401, 'You are not authorized to access the data.')
        return
      }

      req.tenant = user.tenant
      req.logIn(user, { session: false }, (logInErr) => {
        if (logInErr) {
          error(res, 500, 'Internal server error! Please try again later.')
        }
        next()
      })
    })(req, res, next)
  }
}

passport.use('password', new BasicStrategy((givenEmail, givenPassword, done) => {
  done(null, { givenEmail, givenPassword })
}))

passport.use('master', new BearerStrategy((tokenParam, done) => {
  if (tokenParam === masterKey) {
    done(null, true)
  } else {
    done(null, false)
  }
}))

passport.use('token', new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    function (req) {
      let reqToken = null
      if (req && req.cookies) {
        reqToken = req.cookies.jwt
      }
      return reqToken
    }
  ])
}, ({ id }, done) => {
  User.findById(id).then(user => {
    done(null, user)
  }).catch(done)
}))
