import { success, notFound, authorOrAdmin, error } from '../../src/services/response.js'
import { jest } from '@jest/globals'

let res = {
  status: jest.fn(() => res),
  json: jest.fn(() => res),
  end: jest.fn(() => res)
}

describe('Success middleware tests', () => {
  it('I should see 200 response when I pass no status.', () => {
    success(res)({ prop: 'value' })
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('I should see 201 response when I pass 201.', () => {
    success(res, 201)({ prop: 'value' })
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })
})

describe('NotFound middleware tests', () => {
  it('I should see middleware return entity when I pass entity.', () => {
    expect(notFound(res)({ prop: 'value' })).toStrictEqual({ prop: 'value' })
  })

  it('I should see 404 response when I pass no entity.', () => {
    expect(notFound(res)()).toStrictEqual(undefined)
    expect(res.status).toBeCalledWith(404)
    expect(res.json).toBeCalledWith({
      status: 404,
      message: 'Could not find the object.'
    })
  })
})

describe('AuthorOrAdmin middleware tests', () => {
  let user
  let entity
  beforeEach(() => {
    user = {
      id: 1,
      role: 'user'
    }

    entity = {
      author: 1
    }
  })

  it('I should see middleware return entity when I\'m admin.', () => {
    user.role = 'admin'
    expect(authorOrAdmin(res, user, 'author')(entity)).toStrictEqual(entity)
  })

  it('I should see middleware return entity when I\'m author.', () => {
    expect(authorOrAdmin(res, user, 'author')(entity)).toStrictEqual(entity)
  })

  it('I should see middleware return undefined when pass no entity.', () => {
    expect(authorOrAdmin(res, user, 'author')()).toStrictEqual(undefined)
  })

  it('I should see 401 response when I\'m neither author nor admin.', () => {
    entity.author = 2
    expect(authorOrAdmin(res, user, 'author')(entity)).toStrictEqual(undefined)
    expect(res.status).toBeCalledWith(401)
    expect(res.json).toBeCalledWith({
      status: 401,
      message: 'Only admin or the author of the object has the access right.'
    })
  })
})

describe('Error middleware tests', () => {
  it('I should see error response when I call it.', () => {
    error(res, 400, 'Error message.')
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({
      status: 400,
      message: 'Error message.'
    })
  })
})
