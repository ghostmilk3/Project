export const parseTenant = function (req, res, next) {
  req.tenant = req.headers.tenant
  next()
}