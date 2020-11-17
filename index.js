const http = require('http')
const express = require('express')

const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const config = require('./utils/config')




const mongoose = require('mongoose')




mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => {
          logger.info('connected to MongoDB')
        })
        .catch((error) => {
          logger.error('error connecting to MongoDB: ', error.message)
        })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
})