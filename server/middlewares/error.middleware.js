module.exports = (err, req, res, next) => {
  console.error(err)

  const statusCode = err.statusCode || 500

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message

  res.status(statusCode).json({
    success: false,
    message
  })
}
