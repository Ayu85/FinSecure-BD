import { NextFunction, Request, Response, Router } from 'express'
import {
  authCheck,
  loginUser,
  logout,
  registerUser
} from '../controllers/authControllers'
import { searchUser } from '../middlewares/searchUser'

const router = Router()

router.post('/register-user', (req: Request, res: Response) => {
  registerUser(req, res)
})
router.post('/login-user', (req: Request, res: Response) => {
  loginUser(req, res)
})
router.get(
  '/check-auth',
  (req: Request, res: Response, next: NextFunction) => {
    searchUser(req, res, next)
  },
  (req: Request, res: Response) => {
    authCheck(req, res)
  }
)
router.post('/logout', (req: Request, res: Response) => {
  logout(req, res)
})
export default router
