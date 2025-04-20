import { Router, Request, Response } from 'express'
import { ArduinoService } from './arduino.service'

const router = Router()

router.get('/', async (_req, res) => {
  const list = await ArduinoService.list()
  res.json(list)
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const cfg = await ArduinoService.create(req.body)
    res.status(201).json(cfg)
  } catch {
    res.status(400).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const cfg = await ArduinoService.getById(req.params.id)
    res.json(cfg)
  } catch {
    res.status(404).end()
  }
})

router.put('/:id', async (req, res) => {
  try {
    const cfg = await ArduinoService.update(req.params.id, req.body)
    res.json(cfg)
  } catch {
    res.status(400).end()
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await ArduinoService.delete(req.params.id)
    res.status(204).end()
  } catch {
    res.status(404).end()
  }
})

export default router
