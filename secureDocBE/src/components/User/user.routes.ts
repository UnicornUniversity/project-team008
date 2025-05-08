import { Router, Request, Response } from 'express'
import { User } from './user.model'
import { getErrorMessageFromSequelize } from '../../utils/getErrorMessageFromSequelize'

const router = Router()

router.get('/', async (_req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.get('/me', async (req: any, res) => {
  if (req.user) {
    try {
      const loggedUser = await User.findOne({
        attributes: { exclude: ['password'] },
        where: {
          id: req.user.id,
          email: req.user.email,
        },
      })

      if (!loggedUser) {
        return res.status(404).send({ message: `User not found` })
      }

      return res.send(loggedUser)
    } catch (error) {
      console.error('[USER_ERROR]UserService.createUser', error)
      return res
        .status(400)
        .send(
          getErrorMessageFromSequelize(error, `Error getting user`, '[USER]')
        )
    }
  }

  return res.status(404).end()
})

router.get('/:id', async (req, res) => {
  const u = await User.findByPk(req.params.id)
  if (!u) return res.status(404).end()
  res.json(u)
})

router.put('/:id', async (req, res) => {
  const [count, [updated]] = await User.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  })
  if (count === 0) return res.status(404).end()
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  const count = await User.destroy({ where: { id: req.params.id } })
  if (!count) return res.status(404).end()
  res.status(204).end()
})

export default router
