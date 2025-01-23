import { Request, Response } from 'express'
import { prismaClient } from '..'

export const getWalletOwnerName = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { walletID } = req.body
    const id = parseInt(walletID)
    const walletOwner = await prismaClient.wallet.findFirst({
      where: {
        walletId: id
      },
      select: {
        owner: {
          select: {
            fullName: true
          }
        }
      }
    })
    if (walletOwner) return res.status(200).json(walletOwner)
    return res
      .status(500)
      .json({ message: 'Invalid wallet!!', success: false })
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}
