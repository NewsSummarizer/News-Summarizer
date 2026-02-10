const User = require('../models/User.model')

exports.getMe = async (req, res, next) => {
  try {
    const user = await User
      .findById(req.userId)
      .select('-password')

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (err) {
    next(err)
  }
}
