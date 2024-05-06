import { success, notFound, error } from '../../services/response.js'
import { sendMail } from '../../services/sendgrid.js'
import ResetPassword from './model.js'
import User from '../user/model.js'

export const create = function ({ tenant, body: { email, link } }, res, next) {
  User.byTenant(tenant)
    .findOne({ email })
    .then(notFound(res))
    .then(user => user ? ResetPassword.byTenant(tenant).create({ user }) : null)
    .then(resetPassword => {
      if (!resetPassword) {
        error(res, 400, 'Create reset password request failed.')
        return
      }
      const { user, token } = resetPassword
      link = `${link.replace(/\/$/, '')}/${token}`
      const content = `
                Hey, ${user.name}.<br><br>
                You requested a new password for your Yxu Service account.<br>
                Please use the following link to set a new password. It will expire in 1 hour.<br><br>
                <a href="${link}">${link}</a><br><br>
                If you didn't make this request then you can safely ignore this email. :)<br><br>
                &mdash; Yxu Service Team`
      return sendMail(email, 'Yxu Service - Password Reset', content)
    })
    .then(([response]) => response ? res.status(response.statusCode).end() : null)
    .catch(next)
}

export const show = function ({ tenant, params: { token } }, res, next) {
  ResetPassword.byTenant(tenant)
    .findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then(resetPassword => resetPassword ? resetPassword.view(true) : null)
    .then(success(res))
    .catch(next)
}

export const update = function ({ tenant, params: { token }, body: { password } }, res, next) {
  ResetPassword.byTenant(tenant)
    .findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then(resetPassword => {
      if (!resetPassword) {
        return null
      }
      const user = resetPassword.user
      return user.set({ password })
        .save()
        .then(() => ResetPassword.deleteMany({ user }))
        .then(() => user.view(true))
    })
    .then(success(res))
    .catch(next)
}
