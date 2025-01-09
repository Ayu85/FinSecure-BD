import { NextFunction, Request, Response } from 'express'
import { prismaClient } from '..'

export const validateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.body.customer
    const { accountNumber } = req.body
    const matchIdandAc = await prismaClient.account.findFirst({
      where: {
        ownerId: customerId,
        accountNumber: accountNumber
      }
    })
    if (!matchIdandAc)
      return res
        .status(401)
        .json({ message: 'Invalid account details', success: false })
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error in account validation', success: false })
  }
}