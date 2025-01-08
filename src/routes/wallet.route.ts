import { NextFunction, Request, Response, Router } from 'express'
import { createWallet } from '../controllers/walletControllers'
import { searchUser } from '../middlewares/searchUser'

const router = Router()
router.post(
  '/create-wallet',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response) => {
    createWallet(req, res)
  }
)

export const walletRouter = router
