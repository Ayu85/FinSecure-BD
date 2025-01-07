import { Request, Response, Router } from 'express'
import { registerUser } from '../controllers/authControllers'

const router = Router()

router.post('/register-user', (req: Request, res: Response) => {
  registerUser(req, res)
})
export default router
