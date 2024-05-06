import express from 'express'
import user from './user/index.js'
import auth from './auth/index.js'
import author from './author/index.js'
import book from './book/index.js'
import resetPassword from './resetPassword/index.js'

const { Router } = express

const router = new Router()

router.use('/users', user)
router.use('/auth', auth)
router.use('/resetPassword', resetPassword)
router.use('/author', author)
router.use('/book', book)

export { router as api }
