import { File } from './file.model'
import { User } from '../User/user.model'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcrypt'
import { Request } from 'express'
import dotenv from 'dotenv'
import { FileAccess } from '../FileAccess/fileAccess.model'
import { Op } from 'sequelize'
dotenv.config()

export class FileService {
  static async listAll() {
    return File.findAll({
      include: [{ model: User, as: 'uploader', attributes: ['id', 'email'] }],
    })
  }

  static async upload(req: Request) {
    if (!req.file) throw new Error('No file uploaded')

    const { originalname, filename, size, path: tmpPath } = req.file as any
    const uploadsDir = path.resolve(__dirname, '../../../uploads')

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const dest = path.join(uploadsDir, filename)
    fs.renameSync(tmpPath, dest)

    const file = await File.create({
      fileName: originalname,
      localUrl: dest,
      size,
      owner: req.user!.id,
      hardwarePinHash: null,
      createdBy: req.user!.id,
    })

    return file
  }

  static async getById(id: string) {
    const f = await File.findByPk(id, {
      include: [{ model: User, as: 'uploader', attributes: ['id', 'email'] }],
    })
    if (!f) throw new Error('Not found')
    return f
  }

  static async update(id: string, data: any) {
    const [cnt, [updated]] = await File.update(data, {
      where: { id },
      returning: true,
    })
    if (!cnt) throw new Error('Not found')
    return updated
  }

  static async delete(id: string) {
    const cnt = await File.destroy({ where: { id } })
    if (!cnt) throw new Error('Not found')
  }

  static async setHardwarePin(id: string, pin: string) {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(pin, salt)
    const file = await File.findByPk(id)
    if (!file) throw new Error('Not found')
    file.hardwarePinHash = hash
    await file.save()
    return file
  }

  static async listForUser(userId: number) {
    const accessRows = await FileAccess.findAll({
      where: { userId },
      attributes: ['fileId'],
    })
    const accessibleIds = accessRows.map((r) => r.fileId)

    return File.findAll({
      where: {
        [Op.or]: [
          { owner: userId },
          { id: accessibleIds.length ? accessibleIds : 0 },
        ],
      },
      include: [{ model: User, as: 'uploader', attributes: ['id', 'email'] }],
    })
  }

  static async lockToArduino(
    fileId: string,
    arduinoId: string,
    userId: string,
    pinHash: string
  ) {
    const file = await File.findByPk(fileId)
    if (!file) {
      const err = new Error('File not found')
      ;(err as any).status = 404
      throw err
    }
    if (file.owner !== userId) {
      const err = new Error('You do not own this file')
      ;(err as any).status = 403
      throw err
    }
    if (!pinHash) {
      const err = new Error('Missing pinHash')
      ;(err as any).status = 400
      throw err
    }

    file.hardwarePinHash = pinHash
    file.arduinoConfigId = Number(arduinoId)
    await file.save()

    return file
  }
}
