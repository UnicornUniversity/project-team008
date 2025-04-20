// File: src/components/Download/download.service.ts
import { File } from '../File/file.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export class DownloadService {
  static async generateToken(
    id: number,
    hardwarePin?: string
  ): Promise<string> {
    const f = await File.findByPk(id)
    if (!f) throw Object.assign(new Error('Not found'), { status: 404 })

    if (f.hardwarePinHash) {
      if (
        !hardwarePin ||
        !(await bcrypt.compare(hardwarePin, f.hardwarePinHash))
      ) {
        throw Object.assign(new Error('Forbidden'), { status: 403 })
      }
    }

    return jwt.sign({ fileId: id }, process.env.DOWNLOAD_TOKEN_SECRET!, {
      expiresIn: '5m',
    })
  }

  static async verifyTokenAndGetPath(
    id: number,
    token: string
  ): Promise<string> {
    let payload: any
    try {
      payload = jwt.verify(token, process.env.DOWNLOAD_TOKEN_SECRET!) as {
        fileId: number
      }
    } catch {
      throw Object.assign(new Error('Invalid or expired download token'), {
        status: 403,
      })
    }
    if (payload.fileId !== id) {
      throw Object.assign(new Error('Token does not match file'), {
        status: 403,
      })
    }

    const f = await File.findByPk(id)
    if (!f) throw Object.assign(new Error('Not found'), { status: 404 })
    return f.localUrl
  }
}
