import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
dotenv.config()
const server = express()
const PORT = process.env.PORT
const logFilePath = path.join(__dirname, 'logs', 'app.log')

server.use((req, res, next) => {
  const log = `{url:${req.url},type:${
    req.method
  },timestamp:${new Date().toLocaleTimeString()}}`
  // Append the log entry to the file
  console.log(log)
  fs.appendFile(logFilePath, log, err => {
    if (err) {
      console.error('Error writing to log file:', err)
    }
  })

  next()
})

server.listen(PORT, () => {
  console.log(`Banking Server Running on PORT:${PORT}`)
})