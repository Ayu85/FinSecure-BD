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
        fromAccountNo: {
          in: totalAccounts
        }
      }
    })

    console.log('Transactions:', transactions)

    res.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    // Send an error response
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}
export const initiateTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, fromAccountNo, toAccountNo, toIFSC, toAccountName } =
      req.body
    if (!amount || !fromAccountNo || !toAccountNo || !toIFSC || !toAccountName)
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
      if (intAmount > fromAccount.balance) throw new Error('Insufficient balance')

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
          amount:intAmount
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
