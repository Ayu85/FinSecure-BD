import { Request, Response } from 'express'
import { prismaClient } from '..'

export const getAccountOwnerName = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { accountNo, ifsc } = req.body
    const ownerName = await prismaClient.account.findFirst({
      where: { accountNumber: accountNo, ifsc: ifsc },
      select: {
        owner: {
          select: {
            fullName: true
          }
        }
      }
    })
    if (!ownerName)
      return res
        .status(404)
        .json({ message: 'Account verification failed', success: false })
    return res.status(200).json({ message: 'Account Verified!!', ownerName })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}
