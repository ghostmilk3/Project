import express from 'express'
import { create, show, update } from './controller.js'
import { parseTenant } from '../../services/util.js'

const router = new express.Router()

router.post('/',
  parseTenant,
  create)

router.get('/:token',
  parseTenant,
  show)

router.put('/:token',
  parseTenant,
  update)

export default router
