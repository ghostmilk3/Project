import express from 'express'
import querymen from 'querymen'
import { token } from '../../services/passport.js'
import { find, findOne, initAuthor, update, destroy } from './controller.js'

const router = new express.Router()
const query = querymen.middleware

router.get('/',
  token(),
  query(),
  find)

router.get('/:id',
  token(),
  findOne)

router.post('/initAuthor',
  token(),
  initAuthor)

router.put('/:id',
  token(),
  update)

router.delete('/:id',
  // token(['admin']) // For admin
  token(),
  destroy)

export default router
