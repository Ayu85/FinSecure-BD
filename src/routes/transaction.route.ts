import { NextFunction, Request, Response, Router } from 'express'
import { searchUser } from '../middlewares/searchUser'
import { fetchSentTransactions, fetchTransactions, initiateTransaction } from '../controllers/transactionController'

const tranactionRoute = Router()
tranactionRoute.get(
  '/fetch-total',
 (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
 (req: Request, res: Response) => {
    fetchTransactions(req, res)
  }
)
tranactionRoute.post(
  '/initiate-transaction',
 (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
 (req: Request, res: Response) => {
    initiateTransaction(req, res)
  }
)
tranactionRoute.get(
  '/sent-transactions',
 (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
 (req: Request, res: Response) => {
    fetchSentTransactions(req, res)
  }
)
export default tranactionRoute