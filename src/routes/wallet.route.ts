import { NextFunction, Request, Response, Router } from 'express'
import {
  createWallet,
  fetchWallets,
  selfAccountToWallet
} from '../controllers/walletControllers'
import { searchUser } from '../middlewares/searchUser'
import { validateWallet } from '../middlewares/validateWallet'
import { validateAccount } from '../middlewares/validateAccount'
import { getWalletOwnerName } from '../middlewares/getWalletOwnerName'

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

router.post(
  '/transfer-self-wallet',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response, next: NextFunction) => {
    validateWallet(req, res, next)
  },
  (req: Request, res: Response, next: NextFunction) => {
    validateAccount(req, res, next)
  },
  (req: Request, res: Response) => {
    selfAccountToWallet(req, res)
  }
)

router.get(
  '/fetch-wallets',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response) => {
    fetchWallets(req, res)
  }
)
router.post('/get-wallet-owner', (req: Request, res: Response) => {
  getWalletOwnerName(req, res)
})

export const walletRouter = router
