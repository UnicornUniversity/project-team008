import { Router, Request, Response } from 'express'
import { FileAccessService } from './fileAccess.service'

const router = Router({ mergeParams: true })

router.get('/', async (req: Request, res: Response) => {
  const list = await FileAccessService.listForFile(req.params.id)
  res.json(list)
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, permission } = req.body
    const fa = await FileAccessService.grantAccess(
      req.params.id,
      userId,
      permission
    )
    res.status(201).json(fa)
  } catch {
    res.status(403).end()
  }
})

export default router
