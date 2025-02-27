import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import authRoutes from './routes/auth.route'
import { PrismaClient } from '@prisma/client'
import { walletRouter } from './routes/wallet.route'
import cookieParser from 'cookie-parser'
import accountRoute from './routes/account.route'
import tranactionRoute from './routes/transaction.route'
dotenv.config()
const server = express()
const PORT = process.env.PORT
export const prismaClient = new PrismaClient()
const logFilePath = path.join(__dirname, 'logs', 'app.log')
server.use((req, res, next) => {
  const log = `{url:${req.url},type:${
    req.method
  },timestamp:${new Date().toLocaleTimeString()}}\n` // Added \n at the end of the log

  // Append the log entry to the file
  console.log(log)
  fs.appendFile(logFilePath, log, err => {
    if (err) {
      console.error('Error writing to log file:', err)
    }
  })

  next()
})
server.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
server.use(express.json())
server.use(cookieParser())
server.use('/api/v1/auth', authRoutes)
server.use('/api/v1/wallet', walletRouter)
server.use('/api/v1/account',accountRoute)
server.use('/api/v1/transaction',tranactionRoute)
server.listen(PORT, () => {
  console.log(`Banking Server Running on PORT:${PORT}`)
})
