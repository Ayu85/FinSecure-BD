import { Request, Response, Router } from 'express'
import { loginUser, registerUser } from '../controllers/authControllers'

const router = Router()

router.post('/register-user', (req: Request, res: Response) => {
  registerUser(req, res)
})
router.post('/login-user', (req: Request, res: Response) => {
  loginUser(req, res)
})
export default router
