import { Request, Response } from 'express'
import { prismaClient } from '..'
import {
  generateBankAccountNumber,
  generateIFSCCode,
  generateInternetBankingID
} from '../utils/utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
    const checkUser = await prismaClient.customer.findFirst({
      where: {
        aadharNumber
      }
    })
    if (checkUser)
      return res
        .status(400)
        .json({ message: 'Customer Already Exists', success: false })
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
          ifsc: generateIFSCCode().toUpperCase(),
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
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'missing fields', success: false })
    const checkUser = await prismaClient.customer.findFirst({
      where: { email }
    })
    if (!checkUser)
      return res.status(404).json({ message: 'User not found', success: false })
    const matchPassword = await bcrypt.compare(password, checkUser.password)
    if (!matchPassword)
      return res
        .status(400)
        .json({ message: 'Invalid Password', success: false })
    const secret = process.env.JWT_SECRET
    if (!secret)
      return res.status(400).json({ message: 'Jwt Auth Error', success: false })
    const token = jwt.sign({ customerId: checkUser.custId }, secret)
    const { password: _, ...customerWithoutPass } = checkUser
    return res
      .cookie('token', token, {
        sameSite: true,
        secure: true,
        httpOnly: true
      })
      .status(200)
      .json({
        message: 'User logged in',
        success: true,
        user: customerWithoutPass
      })
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false })
  }
}
export const authCheck = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body.customer
    const user = await prismaClient.customer.findFirst({
      where: { custId: customerId }
    })
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)

    return res.status(401).json({ message: 'Unauthorised user' })
  }
}
export const logout = async (req: Request, res: Response) => {
  try {
    return res
      .cookie('token', '')
      .status(200)
      .json({ message: 'Logged out successfully' })
  } catch (error) {
    return res.status(500).json({message:"Logout failed"})
  }
}
