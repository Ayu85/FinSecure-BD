import e, { Request, Response } from 'express'
import { prismaClient } from '..'
import { generateTransactionID } from '../utils/utils'

export const fetchTransactions = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body.customer

    const accounts = await prismaClient.account.findMany({
      where: { ownerId: customerId }
    })

    const totalAccounts = accounts.map(account => account.accountNumber)
    console.log('Total Accounts:', totalAccounts)

    const transactions = await prismaClient.transaction.findMany({
      where: {
        OR: [
          {
            fromAccountNo: {
              in: totalAccounts
            }
          },
          {
            toAccountNo: {
              in: totalAccounts
            }
          }
        ]
      }
    })

    console.log('Transactions:', transactions)

    res.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}
export const initiateTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, fromAccountNo, toAccountNo, toIFSC } = req.body
    if (!amount || !fromAccountNo || !toAccountNo || !toIFSC)
      return res.status(400).json({ message: 'Missing fields', success: false })
    const intAmount = parseInt(amount)

    const trans = await prismaClient.$transaction(async prisma => {
      const fromAccount = await prisma.account.findUnique({
        where: {
          accountNumber: fromAccountNo
        }
      })

      if (!fromAccount) throw new Error("Sender's account not found")

      const toAccount = await prisma.account.findUnique({
        where: {
          accountNumber: toAccountNo,
          ifsc: toIFSC
        }
      })
      if (!toAccount) {
        throw new Error("Recipent's account not found")
      }
      if (intAmount > fromAccount.balance)
        throw new Error('Insufficient balance')

      const fromAccountUpdate = await prisma.account.update({
        where: { accountNumber: fromAccountNo },
        data: {
          balance: fromAccount.balance - intAmount
        }
      })
      const toAccountUpdate = await prisma.account.update({
        where: { accountNumber: toAccountNo },
        data: {
          balance: toAccount.balance + intAmount
        }
      })
      const transacion = await prisma.transaction.create({
        data: {
          id: generateTransactionID(),
          fromAccountNo,
          toAccountNo,
          amount: intAmount
        }
      })
      return transacion
    })
    if (trans) {
      return res
        .status(200)
        .json({ message: 'Transfer successfull', transaction: trans })
    }
  } catch (error) {
    console.log(error)
    const errorMessage =
      error instanceof Error ? error.message : 'Error while fund transfer'
    res.status(500).json({ message: errorMessage, success: false })
  }
}
export const fetchSentTransactions = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body.customer
    const accounts = await prismaClient.account.findMany({
      where: { ownerId: customerId }
    })
    let allAccounts = accounts.map(ac => ac.accountNumber)
    const sentTransactions = await prismaClient.transaction.findMany({
      where: {
        fromAccountNo: {
          in: allAccounts
        }
      }
    })
    res.json(sentTransactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}
export const fetchRecvdTransactions = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body.customer
    const accounts = await prismaClient.account.findMany({
      where: { ownerId: customerId }
    })
    let allAccounts = accounts.map(ac => ac.accountNumber)
    const sentTransactions = await prismaClient.transaction.findMany({
      where: {
        toAccountNo: {
          in: allAccounts
        }
      }
    })
    res.json(sentTransactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}

export const selfTransfer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { customerId } = req.body.customer
    const { fromAC, toAC, amount } = req.body
    if (fromAC === toAC)
      return res.status(400).json({ message: 'From and To Accounts cant be same', success: false })

    if (!fromAC || !toAC || !amount)
      return res.status(400).json({ message: 'Missing fields', success: false })
    const amt = parseInt(amount)
    const verifyFromAC = await prismaClient.account.findUnique({
      where: {
        accountNumber: fromAC,
        ownerId: customerId
      }
    })

    if (verifyFromAC && amt > verifyFromAC?.balance)
      return res
        .status(400)
        .json({ message: 'Insufficient balance', success: false })
    const verifyToAC = await prismaClient.account.findUnique({
      where: {
        accountNumber: toAC,
        ownerId: customerId
      }
    })

    if (!verifyFromAC || !verifyToAC)
      return res
        .status(400)
        .json({ message: 'Account verification failed', success: false })
    const transaction = await prismaClient.$transaction(async prisma => {
      const from = await prisma.account.update({
        where: { accountNumber: fromAC },
        data: { balance: verifyFromAC.balance - amt }
      })
      const to = await prisma.account.update({
        where: { accountNumber: toAC },
        data: { balance: verifyToAC.balance + amt }
      })
      const trans = await prisma.transaction.create({
        data: {
          id: generateTransactionID(),
          amount: amt,
          fromAccountNo: fromAC,
          toAccountNo: toAC
        }
      })
      return { from, to }
    })
    return res.status(200).json({ error: 'Self transfer done', transaction })
  } catch (error) {
    console.error('Error self transactions:', error)
    return res.status(500).json({ error: 'Self transfer failed' })
  }
}
