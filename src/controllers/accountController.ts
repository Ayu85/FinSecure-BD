import { Request, Response } from 'express'
import { prismaClient } from '..'
import { generateBankAccountNumber, generateIFSCCode } from '../utils/utils'

export const getAccounts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { customerId } = req.body.customer
    const accounts = await prismaClient.account.findMany({
      where: {
        ownerId: customerId
      }
    })
    return res.status(200).json({ accounts })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}

export const openAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { customerId } = req.body.customer
    const { type } = req.body
    const account = await prismaClient.account.create({
      data: {
        ownerId: customerId,
        accountNumber: generateBankAccountNumber(),
        ifsc: generateIFSCCode(),
        type: type
      }
    })

    return res
      .status(200)
      .json({ message: 'Account created successfully', account })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false })
  }
}
