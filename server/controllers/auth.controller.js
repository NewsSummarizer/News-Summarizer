const bcrypt = require('bcrypt')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken} = require('../utils/token')

exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        email,
        password: hashedPassword
      })

      res.status(201).json({ message: 'User created'})
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ message: 'Invalid credentials' })

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ accessToken })
    } catch (err) {
        next(err)
    }
}

exports.refresh = (req, res) => {
    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)

        const newAccessToken = generateAccessToken(decoded.userId)
        res.json({ accessToken: newAccessToken })
    })
}

exports.logout = (req, res) => {
    res.clearCookie('refreshToken')
    res.sendStatus(204)
}
