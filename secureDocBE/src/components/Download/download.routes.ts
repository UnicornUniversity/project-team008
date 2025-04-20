import { Router, Request, Response } from 'express'
import { DownloadService } from './download.service'

const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const link = await DownloadService.getDownloadLink(
      req.params.id,
      req.header('hardware-pin') || undefined
    )
    res.json(link)
  } catch (err: any) {
    res.status(err.status || 404).json({ message: err.message })
  }
})

export default router
