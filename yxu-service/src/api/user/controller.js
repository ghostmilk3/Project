import { success, notFound, error } from '../../services/response.js'
import User from './model.js'

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  User.byTenant(tenant)
    .find(query, select, option)
    .then(users => users.map(user => user.view()))
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  User.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(user => user ? user.view() : null)
    .then(success(res))
    .catch(next)
}

export const create = function ({ tenant, body }, res, next) {
  User.byTenant(tenant)
    .findOne({ email: body.email })
    .then(user => {
      if (user) {
        error(res, 409, 'User with the same email already exists.')
      } else {
        User.byTenant(tenant)
          .create(body)
          .then(createdUser => createdUser.view(true))
          .then(success(res, 201))
          .catch(err => {
            if (err.name === 'ValidationError') {
              error(res, 400, err.message)
            } else {
              next(err)
            }
          })
      }
    })
}

export const initAdmin = function ({ headers: { tenant }, body }, res, next) {
  if (!tenant) {
    error(res, 400, 'Please provide a tenant.')
  } else {
    User.byTenant(tenant)
      .find()
      .then(({ length }) => {
        if (length) {
          error(res, 400, `Tenant ${tenant} already exists.`)
        } else {
          User.byTenant(tenant)
            .create(body)
            .then(user => user.view(true))
            .then(success(res, 201))
            .catch(err => {
              next(err)
            })
        }
      })
  }
}

export const update = function ({ tenant, body, params: { id }, user }, res, next) {
  User.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(result => {
      if (!result) {
        return null
      }
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data.'
        })
        return null
      }
      return result
    })
    .then(foundUser => foundUser ? Object.assign(foundUser, body).save() : null)
    .then(savedUser => savedUser ? savedUser.view(true) : null)
    .then(success(res))
    .catch(next)
}

export const updatePassword = function ({ tenant, body: { password }, params: { id }, user }, res, next) {
  User.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(result => {
      if (!result) {
        return null
      }
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password.'
        })
        return null
      }
      return result
    })
    .then(foundUser => foundUser ? foundUser.set({ password }).save() : null)
    .then(savedUser => savedUser ? savedUser.view(true) : null)
    .then(success(res))
    .catch(next)
}

export const destroy = function ({ tenant, params: { id } }, res, next) {
  User.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(user => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
}
