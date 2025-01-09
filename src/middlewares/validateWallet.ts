import { NextFunction, Request, Response } from 'express'
import { prismaClient } from '..'

export const validateWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.body.customer
    const { walletId } = req.body
    console.log(customerId, walletId)

    const searchWalletAndUser = await prismaClient.wallet.findFirst({
      where: {
        walletId: walletId,
        ownerId: customerId
      }
    })
    if (!searchWalletAndUser)
      return res
        .status(401)
        .json({ message: 'Invalid Wallet Id', success: false })
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error in wallet validation', success: false })
  }
}
