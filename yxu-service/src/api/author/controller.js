import { success, notFound, error } from '../../services/response.js'
import Author from './model.js'
import User from '../user/model.js'

// 上传作者信息（必须是管理员权限）
export const initAuthor = function ({ tenant, body, params: { token } }, res, next) {
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
          .create(body)
          .then(createdAuthor => createdAuthor.view(true))
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

export const find = function ({ tenant, querymen: { query, select, option } }, res, next) {
  Author.byTenant(tenant)
    .find(query, select, option)
    .then(authors => authors.map(author => author.view()))
    .then(success(res))
    .catch(next)
}

export const findOne = function ({ tenant, params: { id } }, res, next) {
  Author.byTenant(tenant)
    .findOne({ id })
    .then(notFound(res))
    .then(author => author ? author.view() : null)
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
        Author.byTenant(tenant)
          .findOne({ id })
          .then(notFound(res))
          .then(result => {
            if (!result) {
              return null
            }
            return result
          })
          .then(foundAuthor => foundAuthor ? Object.assign(foundAuthor, body).save() : null)
          .then(savedAuthor => savedAuthor ? savedAuthor.view(true) : null)
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
        Author.byTenant(tenant)
          .findOne({ id })
          .then(notFound(res))
          .then(author => author ? author.remove() : null)
          .then(success(res, 204))
          .catch(next)
      }
    }
    )
}

