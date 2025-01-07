import { Request, Response } from 'express'
import { prismaClient } from '..'
import {
  generateBankAccountNumber,
  generateIFSCCode,
  generateInternetBankingID
} from '../utils/utils'
import bcrypt from 'bcrypt'
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      fullName,
      aadharNumber,
      contact,
      email,
      pan,
      password,
      postCode,
      line1,
      line2,
      landmark,
      city,
      state
    } = req.body
    const requiredFields = [
      'fullName',
      'aadharNumber',
      'contact',
      'email',
      'pan',
      'password',
      'postCode',
      'line1',
      'line2',
      'landmark',
      'city',
      'state'
    ]
    const missingFields = requiredFields.filter(field => !req.body[field])
    // If there are missing fields, return a response with the list of missing fields
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const result = await prismaClient.$transaction(async prisma => {
      const user = await prisma.customer.create({
        data: {
          fullName,
          aadharNumber,
          contact,
          email,
          pan,
          password: passwordHash,
          bankingId: generateInternetBankingID()
        }
      })
      const account = await prisma.account.create({
        data: {
          accountNumber: generateBankAccountNumber(),
          ifsc: generateIFSCCode(),
          ownerId: user.custId
        }
      })

      const address = await prisma.address.create({
        data: {
          custId: user.custId,
          line1,
          line2,
          landmark,
          postCode,
          city,
          state
        }
      })
      const { password: _, ...userWithoutPassword } = user // Remove the password from the user object
      return { user: userWithoutPassword, account, address }
    })
    return res.status(200).json({
      message: 'Account Creation Successfull!',
      user: result.user,
      account: result.account,
      address: result.address
    })
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}
