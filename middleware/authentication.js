const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { userModel } = require('../model/userModel')
const { userRouter } = require('../routes/userRoutes')
const {blacklist } = require('../config/blacklist')
require('dotenv').config()

const authmiddlware = async(req, res, next ) =>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(blacklist.include(token)){
            return res.send("Plase login again")
        }

        const decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN)
        // console.log(decodeToken)
        const {userId} = decodeToken;

        //check if the user is exists
        const user = await userModel.findById(userid)
        if(!user){
            return res.status(401).json({msg: "unauthorised"})
        }

        req.user = user;
    } catch (error) {
        console.log(error)
        return res.status(401).json({msg: "unauthorised", err: error.message})
    }
}

module.exports = {authmiddlware}