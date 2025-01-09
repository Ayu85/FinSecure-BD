import { Request, Response } from 'express'
import { prismaClient } from '..'

export const createWallet = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body.customer
    const { walletName } = req.body
    const wallet = await prismaClient.wallet.create({
      data: {
        walletName,
        ownerId: customerId
      }
    })
    return res
      .status(200)
      .json({ message: 'Wallet created successfully', wallet })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}
export const selfAccountToWallet = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body.customer
    const { walletId, accountNumber } = req.body
    console.log("success valid");
    
  } catch (error) {}
}
