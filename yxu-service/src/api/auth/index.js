import express from 'express'
import { login } from './controller.js'
import { password } from '../../services/passport.js'

const router = new express.Router()

router.post('/',
  password(),
  login)

export default router
