const express = require('express')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const  {logger } = require('../config/logger')
const { createClient } = require('redis')
const client = createClient()
const {authmiddlware} = require('../middleware/authentication')
const { redisclient } = require('../config/redis')
const weatherRoutes =express.Router()

require('dotenv').config()


client.on('error', err =>
console.log('Redis Client Error', err))

client.connect()


weatherRoutes.get('/cityname', async(req,res) =>{
    let city = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Hirakud&appid=d65de52c0d795ff345deac94de5c5985')
    // console.log(city)
    await client.set(` ${city}`)
    res.send(city)
})

module.exports = { weatherRoutes }