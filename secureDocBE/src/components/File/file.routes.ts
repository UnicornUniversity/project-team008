import { Router, Request, Response } from 'express'
import multer from 'multer'
import { FileService } from './file.service'

const upload = multer({ dest: 'tmp/' })
const router = Router()

router.get('/', async (_req: any, res) => {
  if (!_req.user) {
    res.status(400).json({ message: 'No user defined.' })
    return
  }
  const files = await FileService.listForUser(Number(_req.user?.id))
  res.json(files)
})

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const f = await FileService.upload(req)
    res.status(201).json(f)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const f = await FileService.getById(req.params.id)
    res.json(f)
  } catch {
    res.status(404).end()
  }
})

router.put('/:id', async (req, res) => {
  try {
    const f = await FileService.update(req.params.id, req.body)
    res.json(f)
  } catch {
    res.status(400).end()
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await FileService.delete(req.params.id)
    res.status(204).end()
  } catch {
    res.status(404).end()
  }
})

export default router
