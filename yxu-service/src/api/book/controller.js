import { success, notFound, error } from '../../services/response.js'
import Book from './model.js'
import User from '../user/model.js'
import Author from '../author/model.js'

export const initBook = function ({ tenant, body, params: { token } }, res, next) {
  User.byTenant(tenant)
    .findOne({ token })
    .then(result => {
      if (!result) {
        return null
      }
      const isAdmin = result.role === 'admin'
      if (!isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'Only administrators can perform this operation.'
        })
        return null
      } else {
        Author.byTenant(tenant)
          .findOne({ id : body.author })
          .then(author => {
            if (!author) {
              return null
            }
            const book = { ...body, author: author }
            Book.byTenant(tenant)
              .create(book)
              .then(createdbook => {
                if (!createdbook) {
                  error(res, 400, 'Create book request failed.')
                  return null
                }
                return createdbook
              })
              .then(success(res, 201))
              .catch(err => {
                if (err.name === 'ValidationError') {
                  error(res, 400, err.message)
                } else {
                  next(err)
                }
              })
          })
      }
    })
}

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Book.byTenant(tenant)
    .find(query, select, option)
    .select('-_id')
    .populate('author')
    .then(books => books.map(book => book.view()))
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  Book.byTenant(tenant)
    .findOne({ id })
    .select('-_id')
    .populate('author')
    .then(notFound(res))
    .then(book => book ? book.view() : null)
    .then(success(res))
    .catch(next)
}

export const update = function ({ tenant, body, params: { id, token } }, res, next) {
  User.byTenant(tenant)
    .findOne({ token })
    .then(confirm => {
      if (!confirm) {
        return null
      }
      const isAdmin = confirm.role === 'admin'
      if (!isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'Only administrators can perform this operation.'
        })
        return null
      } else {
        Book.byTenant(tenant)
          .findOne({ id })
          .select('-_id')
          .populate('author')
          .then(notFound(res))
          .then(result => {
            if (!result) {
              return null
            }
            return result
          })
          .then(foundBook => foundBook ? Object.assign(foundBook, body).save() : null)
          .then(savedBook => savedBook ? savedBook.view(true) : null)
          .then(success(res))
          .catch(next)
      }
    }
    )
}

export const destroy = function ({ tenant, params: { id, token } }, res, next) {
  User.byTenant(tenant)
    .findOne({ token })
    .then(result => {
      if (!result) {
        return null
      }
      const isAdmin = result.role === 'admin'
      if (!isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'Only administrators can perform this operation.'
        })
        return null
      } else {
        Book.byTenant(tenant)
          .findOne({ id })
          .populate('author')
          .then(notFound(res))
          .then(book => book ? book.remove() : null)
          .then(success(res, 204))
          .catch(next)
      }
    }
    )
}