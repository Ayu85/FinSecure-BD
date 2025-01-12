import { NextFunction, Request, Response, Router } from 'express'
import { getAccounts } from '../controllers/accountController'
import { searchUser } from '../middlewares/searchUser'

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
export default accountRoute
