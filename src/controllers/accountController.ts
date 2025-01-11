import { Request, Response } from 'express'
import { prismaClient } from '..'

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.customer
    const accounts = await prismaClient.account.findMany({
      where: {
        ownerId: customerId
      }
    })
    if (accounts) return res.status(200).json({ accounts })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}
