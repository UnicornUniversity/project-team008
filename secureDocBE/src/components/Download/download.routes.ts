// File: src/components/Download/download.routes.ts
import { Router, Request, Response } from 'express'
import { DownloadService } from './download.service'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()
const BASE = process.env.DOWNLOAD_BASE_URL || 'http://localhost:3000'

router.post('/:id', async (req: any, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.sendStatus(401)

    const { hardwarePin, arduinoId } = req.body as {
      hardwarePin?: string
      arduinoId?: number
    }

    const token = await DownloadService.generateToken(
      userId,
      Number(req.params.id),
      hardwarePin,
      arduinoId
    )

    const url = `${BASE}/download/${req.params.id}/file?token=${token}`
    return res.json({ download_url: url })
  } catch (err: any) {
    return res.status(err.status || 400).json({ message: err.message })
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
