import { NextFunction, Request, Response } from 'express'

export const searchUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies
    if(!token)
        return res.status
  } catch (error) {}
}
