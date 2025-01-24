import { Request, Response } from 'express'
import { prismaClient } from '..'

export const createWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
export const selfAccountToWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const wallet = req.wallet
    const account = req.account
    console.log(wallet, account)
    const { walletId, accountNumber, amount } = req.body
    const amt=parseInt(amount)
    if (amount > account.balance)
      return res.status(400).json({ message: 'Invalid amount', success: false })
    const result = await prismaClient.$transaction(async prisma => {
      const updatedAccount = await prisma.account.update({
        where: {
          accountNumber: accountNumber
        },
        data: {
          balance: account.balance - amt
        }
      })
      const updatedWallet = await prisma.wallet.update({
        where: {
          walletId: walletId
        },
        data: {
          balance: wallet.balance + amt
        }
      })
      return { updatedAccount, updatedWallet }
    })

    return res.status(200).json({
      message: 'Transfer Success',
      wallet: result.updatedWallet,
      account: result.updatedAccount
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Server error in wallet transfer', success: false })
  }
}
export const fetchWallets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { customerId } = req.body.customer
    const wallets = await prismaClient.wallet.findMany({
      where: { ownerId: customerId }
    })
    return res.status(200).json(wallets)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Server error in fetching wallets', success: false })
  }
}
