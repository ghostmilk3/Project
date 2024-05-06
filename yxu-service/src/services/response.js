export const success = function (res, status) {
  return function (entity) {
    if (entity) {
      res.status(status || 200).json(entity)
    } else {
      res.status(status || 200).end()
    }
  }
}

export const notFound = function (res) {
  return function (entity) {
    if (entity) {
      return entity
    }
    res.status(404).json({
      status: 404,
      message: 'Could not find the object.404'
    })
  }
}

export const authorOrAdmin = function (res, user, userField) {
  return function (entity) {
    if (entity) {
      const isAdmin = user.role === 'admin'
      const isAuthor = entity[userField] && entity[userField] === user.id
      if (isAuthor || isAdmin) {
        return entity
      }
      res.status(401).json({
        status: 401,
        message: 'Only admin or the author of the object has the access right.'
      })
    }
  }
}

export const error = function (res, status, message) {
  res.status(status).json({
    status,
    message
  })
}
