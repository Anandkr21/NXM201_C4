const redis = require('redis')
require('dotenv').config()

const redisclient = redis.createClient({
    url: "redis://default:OJ9tb4auXU2W5h2uuFw35S3LjKpecQCD@redis-18586.c264.ap-south-1-1.ec2.cloud.redislabs.com:18586"
})

try {
    redisclient.connect()
} catch (error) {
    console.log(err.message)
}

module.exports = { redisclient }