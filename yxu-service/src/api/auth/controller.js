import { sign } from '../../services/jwt.js'
import { success } from '../../services/response.js'

export const login = function ({ user }, res, next) {
  sign(user._id, { expiresIn: 60 * 60 })
    .then(token => {
      res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60,
        sameSite: 'lax',
        secure: false
      })

      return { token, user: user.view(true) }
    })
    .then(success(res, 201))
    .catch(next)
}
