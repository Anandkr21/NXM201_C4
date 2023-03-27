const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userModel } = require('../model/userModel')
const { redisclient } = require('../config/redis')
require('dotenv').config()

const userRouter = express.Router()


//user register
userRouter.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if already registered
        const userExist = await userModel.findOne({ email })
        if (userExist) {
            return res.status(400).json({ "message": "Already registered, Please login" })
        } else {
            const hashed_password = bcrypt.hashSync(password, 8)
            const user = new userModel({ email, password: hashed_password })
            await user.save()
            res.json({ message: "User registered successfully" })
        }
    } catch (error) {
        res.send('something wrong', error.message)
    }
})


//user login
userRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
            expiresIn: 360
        })

        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: 6000
        })

        res.json({ msg: "login succssfull", token, refreshToken })

    } catch (error) {
        console.log(error)
    }
})

//logout
userRouter.get('/logout', async (req, res) => {
    const payload = req.headers.authorization?.split(' ')[1]
    const tokens = JSON.parse(await redisclient.GET(payload))
    console.log(tokens)
    //setting blacklist token in redis
    await redisclient.HSET('blocked', tokens.token)
    res.send('Logout successfully and save into Redis DB')
})
module.exports = { userRouter }