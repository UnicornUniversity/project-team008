// File: src/components/Download/download.routes.ts
import { Router, Request, Response } from 'express'
import { DownloadService } from './download.service'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()
const BASE = process.env.DOWNLOAD_BASE_URL || 'http://localhost:3000'

router.post('/:id', async (req: Request, res: Response) => {
  try {
    const token = await DownloadService.generateToken(
      +req.params.id,
      req.header('hardware-pin') || undefined
    )
    const url = `${BASE}/download/${req.params.id}/file?token=${token}`
    res.json({ download_url: url })
  } catch (err: any) {
    res.status(err.status || 400).json({ message: err.message })
  }
})

router.get('/:id/file', async (req: Request, res: Response) => {
  try {
    const filePath = await DownloadService.verifyTokenAndGetPath(
      +req.params.id,
      req.query.token as string
    )
    res.sendFile(filePath, (err) => {
      if (err) res.status(500).json({ message: 'Failed to send file' })
    })
  } catch (err: any) {
    res.status(err.status || 400).json({ message: err.message })
  }
})

export default router
