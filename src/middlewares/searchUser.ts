import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// Extend Express Request type to include customerId
declare global {
  namespace Express {
    interface Request {
      customer: any
      account: any
      wallet: any
    }
  }
}

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res
        .status(400)
        .json({ message: 'No token provided', success: false })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(400).json({ message: 'Jwt Auth Error', success: false })
    }

    const decoded = jwt.verify(token, secret)

    req.body.customer = decoded
    next()
  } catch (error) {
    console.log(error)

    return res.status(400).json({ message: 'Auth Error', success: false })
  }
}
