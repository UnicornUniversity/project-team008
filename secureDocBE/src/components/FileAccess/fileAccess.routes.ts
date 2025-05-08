// src/components/FileAccess/fileAccess.routes.ts
import { Router, Request, Response } from 'express'
import { FileAccessService } from './fileAccess.service'

const router = Router({ mergeParams: true })

// GET /file/:id/user
router.get('/', async (req: Request, res: Response) => {
  const list = await FileAccessService.listForFile(req.params.id)
  res.json(list)
})

// POST /file/:id/user  → create new access
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, permission } = req.body
    const fa = await FileAccessService.grantAccess(
      req.params.id,
      userId,
      permission
    )
    res.status(201).json(fa)
  } catch (err: any) {
    res.status(err.status || 403).json({ message: err.message })
  }
})

// PUT /file/:id/user/:userId  → update existing access
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id
    const userId = req.params.userId
    const { permission } = req.body
    const fa = await FileAccessService.grantAccess(fileId, userId, permission)
    res.json(fa)
  } catch (err: any) {
    res.status(err.status || 403).json({ message: err.message })
  }
})

// DELETE /file/:id/user/:userId  → revoke access
router.delete('/:userId', async (req: Request, res: Response) => {
  try {
    await FileAccessService.revokeAccess(req.params.id, req.params.userId)
    res.status(204).end()
  } catch (err: any) {
    res.status(err.status || 404).json({ message: err.message })
  }
})

export default router
