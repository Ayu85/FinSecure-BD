import { NextFunction, Request, Response, Router } from 'express'
import { getAccounts, openAccount } from '../controllers/accountController'
import { searchUser } from '../middlewares/searchUser'
import { getAccountOwnerName } from '../middlewares/getAccountOwnerName'

const accountRoute = Router()

accountRoute.get(
  '/fetch-accounts',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response) => {
    getAccounts(req, res)
  }
)

accountRoute.post(
  '/create-account',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response) => {
    openAccount(req, res)
  }
)
accountRoute.post(
  '/get-owner',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response, ) => {
    getAccountOwnerName(req, res)
  }
)
export default accountRoute
