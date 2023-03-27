const express = require('express')
const { connection }= require('./config/db')
const { userRouter } = require('./routes/userRoutes')
const { weatherRoutes } = require('./routes/weatherRoutes')
const {createClient} = require('redis')
const  {logger } = require('./config/logger')
const client = createClient()


require('dotenv').config()
const app = express()
app.use(express.json())


app.get('/', (req,res) =>{
    res.send('welcome')
})

app.use('/user', userRouter)
app.use(authmiddlware)
app.use('/weather', weatherRoutes)


app.listen(process.env.port, async() =>{
    try {
        await connection
        await client.connect()
        console.log("connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on port ${process.env.port}`)
})